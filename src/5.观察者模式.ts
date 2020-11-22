// 发布订阅 发布和订阅 (中间有第三方 arr) 发布和订阅之间没有任何关联
// 观察者模式 观察者和被观察者之间是存在关联的 (内部还是发布订阅)
class Subject {
    public name: string; // 实例上有一个name属性
    public state: string; // 实例上有一个state属性
    public observers: Observer[];
    constructor(name) {
        this.name = name;
        this.state = '我现在很开心';
        this.observers = [];
    }
    attach(o:Observer) { // 传入观测我的人
        this.observers.push(o);
    }
    setState(newState) {
        this.state = newState;
        this.observers.forEach(o=>o.update(this));
    }
}
class Observer{
    public name: string; // 实例上有一个name属性
    constructor(name) {
        this.name = name;
    }
    update(baby:Subject) {
        console.log(baby.name + '对' +this.name + '说' + baby.state);
    }
}
// 我家有个小宝宝 我和我媳妇 需要观测小宝宝的变化
let baby = new Subject('小宝宝');
let o1 = new Observer('爸爸');
let o2 = new Observer('妈妈');

baby.attach(o1);
baby.attach(o2);

baby.setState('我不开心了');
baby.setState('我想吃饭了');