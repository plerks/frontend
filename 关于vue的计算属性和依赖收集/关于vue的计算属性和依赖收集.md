### 关于vue的计算属性和依赖收集

按理说，一个值依赖某些其它值时，实现计算属性的基本思路是在依赖项被set时重新计算(以java为例)：

```java
public class ComputedAttributeDemo {
    // 属性声明为private, 防止外部不走setter方法直接改值, 导致没有重新计算
    private String name;
    private String version;
    private String identifier;

    public ComputedAttributeDemo() {
        this.name = "";
        this.version = "";
        this.identifier = "";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.computeIdentifier();
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
        this.computeIdentifier();
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    private void computeIdentifier() {
        this.setIdentifier(this.name + this.version);
    }
}
```

(PS: Angular没有计算属性，不过Angular像Java，类似这样写应该能实现计算属性的效果，不过不知道有没有性能什么的问题)

参考链接：

<https://zhuanlan.zhihu.com/p/45081605>

<https://www.cnblogs.com/yangzhou33/p/13809534.html>

<https://www.cnblogs.com/yangzhou33/p/13786683.html>

<https://juejin.cn/post/6844903574007185415>

没读的很仔细，但大概能让我理解vue的依赖收集是怎么做的。上面ComputedAttributeDemo类的方式需要写代码的人知道依赖关系，主动把computeIdentifier()方法在依赖项的setter里进行调用。而vue的计算属性相当于，写代码的人只需要写上computeIdentifier()方法，不需要知道identifier在什么情况下需要重新计算。也就是说，vue能收集你所定义的计算属性的依赖，从而知道该在什么时候重新计算那个计算属性。

(以下称定义计算属性的那个方法为计算方法(vue官方没这个叫法，只是这里方便))

依赖收集的关键技巧在于调用计算方法进行触发，而不在于方法体具体的内容(js没有提供某种离谱接口，可以返回某个方法里用到的变量)。既然vue控制了属性的getter和setter，那么vue可以通过调用某个计算属性的计算方法，从而使这个计算属性依赖的属性的getter被trigger到，从而知道这个计算属性依赖了这个属性。

不知道vue具体的流程，不过vue至少可以这样做(以this.c为一个计算属性，依赖this.a和this.b为例)：在组件实例的初始化过程里，定义一个依赖收集阶段。在这个阶段中，一个个调用computed里面定义的计算方法，当运行特定的一个计算方法时(例如c的计算方法)，其依赖属性a, b的getter调用会被vue拦截到，从而知道属性c依赖属性a, b。然后a, b把c分别记录到各自的Dep里(每个响应式数据都有一个Dep来管理它的依赖)，相当于subscriber向publisher订阅。当属性的setter被调用时，从自己的Dep里获得依赖自己的计算属性，然后一个个重新计算并更新，大致这样一套流程后就能实现依赖收集与自动更新。

(PS: 按照[参考链接](<https://zhuanlan.zhihu.com/p/45081605>)，vue实际需要特别处理数组，因为js里除了对arr重新赋值一个数组外，其他的操作都不会被setter检测到，vue的处理方式是对数组进行一个增强操作，在数组的原型链上定义一系列操作方法，以此实现数组变更的检测)

不知道vue有没有处理循环依赖类似的问题，按这个[链接](https://www.jianshu.com/p/4426e4a98fdc)里的说法是有的。贴一下里面的说法：

---

假设有个属性叫 name, 现在需要一个计算属性 newName, 但是需要在取 newName 的时候再把 name 改成初始值, 由于 name 每次修改的值都不是上一次的值都会触发响应式, 理论上写一个点击方法用来修改一次 name 的值, 处理流程应该是 name --> newName --> name --> newName --> name --> newName .... 然而事实并不会如此

修改 name 的值, 会触发响应式, 那么响应式会调用 trigger 函数, trigger 函数最终会调用 newName 里的响应式副作用(ReactiveEffect)的 scheduler, 而 scheduler 可以根据 ComputedRefImpl 查到实现为 triggerRefValue(this); 也就是调用计算属性 get value 函数, 此时就是在执行 ReactiveEffect 捕捉的 getter 函数并且将该副作用设置为活跃状态的 ReactiveEffect, 也是外面写的 newName 函数, 在这里执行 newName 就会出现对 name 赋新值触发新的 trigger

可以注意的是 trigger 的 key 为正在修改的属性名称, 也就是 name, vue 使用一个 map 通过 key 为 name 来存储 ReactiveEffect 对象

回到上面, 在 newName 中触发新的 trigger, 实际上最后执行的是 triggerEffects, 在这里会对所有的副作用进行遍历, 当然在 newName 中副作用只有一个也就是通过 name 为 key 存储的 ReactiveEffect 对象, 此时它也是活跃状态的 ReactiveEffect, 根据 triggerEffects 中 effect !== activeEffect || effect.allowRecurse 这个判断, 正在执行的 effect 不等于活跃状态的 effect 或者允许递归才会调度 scheduler, 由于当前的 effect === activeEffect, 所以 newName 的 scheduler 也就不会去执行

---
