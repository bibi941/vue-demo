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
        this.currentUser = this.getCurrentUser()
        this.fetchTodos()
    },
    methods: {
        fetchTodos() {
            if (this.currentUser) {
                var query = new AV.Query('AllTodos')
                query.find().then(
                    todos => {
                        let avAllTodos = todos[0]
                        let id = avAllTodos.id
                        this.todoList = JSON.parse(
                            avAllTodos.attributes.content
                        )
                        this.todoList.id = id
                    },
                    function(error) {
                        console.error(error)
                    }
                )
            }
        },
        updateTodos() {
            let dataString = JSON.stringify(this.todoList)
            let avTodos = AV.Object.createWithoutData(
                'AllTodos',
                this.todoList.id
            )
            avTodos.set('content', dataString)
            avTodos.save().then(() => {
                console.log('更新成功')
            })
        },
        change(data) {
            if (data === 'signUp') {
                this.actionType = 'signUp'
            } else if (data === 'signIn') {
                this.actionType = 'signIn'
            }
            this.isActive = !this.isActive //change-Active
        },
        saveTodos() {
            let dataString = JSON.stringify(this.todoList)
            var AVTodos = AV.Object.extend('AllTodos')
            var avTodos = new AVTodos()
            var acl = new AV.ACL()
            acl.setReadAccess(AV.User.current(), true)
            acl.setWriteAccess(AV.User.current(), true)
            avTodos.set('content', dataString)
            avTodos.setACL(acl)
            avTodos.save().then(
                todo => {
                    this.todoList.id = todo.id
                },
                function(error) {
                    // 异常处理
                }
            )
        },
        saveOrUpdateTodos() {
            if (this.todoList.id) {
                this.updateTodos()
            } else {
                this.saveTodos()
            }
        },
        addTodo() {
            if (!this.newTodo) {
                return
            } //input不能为空
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date(),
                date: (function() {
                    let d = new Date()
                    let year = d.getFullYear()
                    let month = d.getMonth() + 1
                    let day =
                        d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
                    let hour = d.getHours()
                    let minutes = d.getMinutes()
                    let seconds = d.getSeconds()
                    return (
                        'TIME:' +
                        year +
                        '.' +
                        month +
                        '.' +
                        day +
                        ' ' +
                        hour +
                        ':' +
                        minutes +
                        ':' +
                        seconds
                    )
                })(),
                done: false
            })
            this.newTodo = ''
            this.saveOrUpdateTodos()
        },
        removeTodo(todo) {
            let index = this.todoList.indexOf(todo) //在todoList中的index
            this.todoList.splice(index, 1) //删除这个todo,从index开始，删除1个
            this.saveOrUpdateTodos()
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
                    alert('用户名已被注册')
                }
            )
        },
        login() {
            AV.User.logIn(this.formData.username, this.formData.password).then(
                loginedUser => {
                    this.currentUser = this.getCurrentUser()
                    this.fetchTodos()
                },
                function(error) {}
            )
        },
        getCurrentUser() {
            let current = AV.User.current()
            if (current) {
                let { id, createdAt, attributes: { username } } = current
                return { id, username, createdAt }
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
