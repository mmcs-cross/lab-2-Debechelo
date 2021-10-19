document.addEventListener('DOMContentLoaded', function() {
    const state = getStoredStateOrDefault({
        counter: 0
    })
    const count = JSON.parse(localStorage.getItem('count'))
    const returnObj = JSON.parse(localStorage.getItem('list_items'))
    const returnState = localStorage.getItem('state_success') ? JSON.parse(localStorage.getItem('state_success')) : {}

    let elementOfList

    if (Object.keys(returnObj).length !== 0) {
        for (key in returnObj) {
            if (returnState[key] == 'true') {
                elementOfList = '<div class="element-todo-list"><div class="success element_of_list"><input type="checkbox" onclick="checkTask(this)" checked class="checkbox_task" id = "' + key + '">' + returnObj[key] + '</div><i onclick="removeTask(this)" class="fas fa-times" style="display:none"></i></div>'

            } else {
                elementOfList = '<div class="element-todo-list"><div class="element_of_list"><input type="checkbox" onclick="checkTask(this)" class="checkbox_task" id = "' + key + '">' + returnObj[key] + '</div><i onclick="removeTask(this)" class="fas fa-times"></i></div>'
            }
            $('.todo_list').append(elementOfList)
        }
        gaugePhotoDisplay('block', 'none', 'none', 'block', 'none')
    } else {
        gaugePhotoDisplay('none', 'block', 'none', 'none', 'block')
    }


    const $gauge = document.querySelector('.gauge')
    setGaugePercent($gauge, state.counter)



    if (state.counter == 100) {
        gaugePhotoDisplay('none', 'none', 'block', 'none', 'block')
    }
    document.getElementsByClassName('count_task')[0].style.display = 'block'
    countToDo.textContent = countOfTask + " tasks to do"


})

const state = getStoredStateOrDefault({
    counter: 0
})

var newTask = document.querySelector('.input_text')
var addTaskbtn = document.querySelector('.add_task')
var newTaskIn = document.querySelector('.input_text_in_scroll')
var addTaskbtnIn = document.querySelector('.add_task_in_scroll')
const $gauge = document.querySelector('.gauge')
const btnNewDay = document.querySelector('.new_day_button')
let countToDo = document.querySelector('.count_task') // переменная для отображ-я кол-ва тасков под кольцом

let listItems = localStorage.getItem('list_items') ? JSON.parse(localStorage.getItem('list_items')) : {} // таски в базе
let countOfTask = localStorage.getItem('count') ? JSON.parse(localStorage.getItem('count')) : 0 //переменная для подсчёта тасков в базе
let id = localStorage.getItem('id_task') ? JSON.parse(localStorage.getItem('id_task')) : 0
let stateSuccess = localStorage.getItem('state_success') ? JSON.parse(localStorage.getItem('state_success')) : {}


function gaugePhotoDisplay(a, b, c, d, e) {
    document.querySelectorAll('.gauge')[0].style.display = a
    document.querySelectorAll('.new_day_screen')[0].style.display = 'none'
    document.querySelectorAll('.all_down_screen')[0].style.display = c
    document.querySelectorAll('.count_task')[0].style.display = d
    document.querySelectorAll('.what_is')[0].style.display = e
}


newTask.addEventListener("keyup", (e) => {
    if (e.keyCode === 13 && inputValid(newTask)) {
        saveTask(newTask)
        gaugePhotoDisplay('block', 'none', 'none', 'block', 'none')
    }
})


addTaskbtn.addEventListener("click", (e) => {
    console.log(newTask)
    if (inputValid(newTask)) {
        saveTask(newTask)
        gaugePhotoDisplay('block', 'none', 'none', 'block', 'none')
    }
})

newTaskIn.addEventListener("keyup", (e) => {
    if (e.keyCode === 13 && inputValid(newTaskIn)) {
        saveTask(newTaskIn)
        gaugePhotoDisplay('block', 'none', 'none', 'block', 'none')
    }
})


addTaskbtnIn.addEventListener("click", (e) => {
    if (inputValid(newTaskIn)) {

        saveTask(newTaskIn)
        gaugePhotoDisplay('block', 'none', 'none', 'block', 'none')
    }
})


btnNewDay.addEventListener("click", (e) => {
    localStorage.clear()
    window.location.reload()
})


function inputValid(task) {
    return (task.value !== "") && (task.value !== " ")

}

//функция для записи тасков в базу
function saveTask(task) {
    listItems[id] = task.value
    localStorage.setItem('list_items', JSON.stringify(listItems))
    addTask(task.value)
    task.value = ""
}


function addTask(taskValue) {
    countOfTask++
    localStorage.setItem('count', JSON.stringify(countOfTask))
    let elementOfList = '<div class="element-todo-list"><div class="element_of_list"><input type="checkbox" onclick="checkTask(this)" class="checkbox_task" id = "' + id + '">' + taskValue + '</div><i onclick="removeTask(this)" class="fas fa-times" ></i></div>'
    $('.todo_list').append(elementOfList)
    id++
    localStorage.setItem('id_task', JSON.stringify(id))
    countToDo.textContent = countOfTask + " tasks to do"

    checkGauge()
}

//функции для расчёта значений кольца
function checkGauge() {
    state.counter = Math.round(Object.keys(stateSuccess).length * 100 / countOfTask)
    saveState(state)
    setGaugePercent($gauge, state.counter)
}

function checkTask(obj) {
    if (!obj.parentElement.classList.contains('success')) {
        obj.parentElement.classList.add('success')
        stateSuccess[obj.parentElement.children[0].id] = "true"
        localStorage.setItem("state_success", JSON.stringify(stateSuccess))
        checkGauge()
        gaugePhotoDisplay('block', 'none', 'none', 'block', 'none')
        obj.parentElement.parentElement.children[1].style.display = 'none'
        if (state.counter == 100) {
            localStorage.clear()
            gaugePhotoDisplay('none', 'none', 'block', 'none', 'block')
        }

    } else {
        for (key in stateSuccess) {
            if (key == obj.id) {
                delete stateSuccess[key]
            }
        }
        localStorage.setItem("state_success", JSON.stringify(stateSuccess))
        obj.parentElement.classList.remove('success')
        obj.parentElement.parentElement.children[1].style.display = 'block'
        gaugePhotoDisplay('block', 'none', 'none', 'block', 'none')
        checkGauge()
    }
}