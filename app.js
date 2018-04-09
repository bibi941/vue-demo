import Vue from 'vue'

var app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: [],
        title: 'To Do List'
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
    },
    methods: {
        addTodo() {
            if (!this.newTodo) {
                return
            }//input不能为空
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date(),
                date: (function () {
                    var d = new Date()
                    var year = d.getFullYear()
                    var month = d.getMonth() + 1
                    var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
                    var hour = d.getHours()
                    var minutes = d.getMinutes()
                    var seconds = d.getSeconds()
                    return 'TIME:'+year + '.' + month + '.' + day + ' ' + hour + ':' + minutes + ':' + seconds
                }()),
                done: false
            })
            this.newTodo = ''
        },
        removeTodo(todo) {
            let index = this.todoList.indexOf(todo) //在todoList中的index
            this.todoList.splice(index, 1) //删除这个todo,从index开始，删除1个
        }
    }
})