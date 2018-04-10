import Vue from 'vue'
import AV from 'leancloud-storage'

let APP_ID = 'I1vRQRic7Nb5TeYbck2bdUP0-gzGzoHsz'
let APP_KEY = 'AVetKsDeAS7CpFWNbbjzCBuk'

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
})

let app = new Vue({
    el: '#app',
    data: {
        isActive: true,
        newTodo: '',
        todoList: [],
        title: 'To Do List',
        actionType: 'signUp',
        formData: {
            username: '',
            password: ''
        },
        currentUser: null
    },
    created() {
        window.onbeforeunload = () => {
            let todoString = JSON.stringify(this.newTodo)
            let dataString = JSON.stringify(this.todoList)
            window.localStorage.setItem('myTodos', dataString)
            window.localStorage.setItem('myinput', todoString)
        }

        let oldDataString = window.localStorage.getItem('myTodos')
        let oldTodoString = window.localStorage.getItem('myinput')
        let oldData = JSON.parse(oldDataString)
        let oldTodo = JSON.parse(oldTodoString)
        this.todoList = oldData || []
        this.newTodo = oldTodo || ''
        this.currentUser = this.getCurrentUser()
    },
    methods: {
        change(data) {
            if (data === 'signUp') {
                this.actionType = 'signUp'
            } else if (data === 'signIn') {
                this.actionType = 'signIn'
            }
            this.isActive = !this.isActive //change-Active
        },
        addTodo() {
            if (!this.newTodo) {
                return
            } //input不能为空
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date(),
                date: (function () {
                    let d = new Date()
                    let year = d.getFullYear()
                    let month = d.getMonth() + 1
                    let day =
                        d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
                    let hour = d.getHours()
                    let minutes = d.getMinutes()
                    let seconds = d.getSeconds()
                    return ('TIME:' + year + '.' + month + '.' + day + ' ' + hour + ':' + minutes + ':' + seconds)
                })(),
                done: false
            })
            this.newTodo = ''
        },
        removeTodo(todo) {
            let index = this.todoList.indexOf(todo) //在todoList中的index
            this.todoList.splice(index, 1) //删除这个todo,从index开始，删除1个
        },
        signUp() {
            let user = new AV.User()
            // 设置用户名
            user.setUsername(this.formData.username)
            // 设置密码
            user.setPassword(this.formData.password)
            user.signUp().then(
                loginedUser => {
                    alert('注册成功！即将跳转页面')
                    this.currentUser = this.getCurrentUser()
                },
                error => {
                    alert('注册失败')
                }
            )
        },
        login() {
            AV.User.logIn(this.formData.username, this.formData.password).then(
                loginedUser => {
                    this.currentUser = this.getCurrentUser()
                },
                function (error) {}
            )
        },
        getCurrentUser() {
            let current = AV.User.current()
            if (current) {
                let {id,createdAt,attributes: {username}} = current
                return {id,username,createdAt}
            } else {
                return null
            }
        },
        logout() {
            AV.User.logOut()
            this.currentUser = null
            window.location.reload()
        }
    }
})