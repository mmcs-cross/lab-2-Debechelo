document.addEventListener('DOMContentLoaded', function() {
    const state = getStoredStateOrDefault({
        counter: 0
    })

    const returnObj = JSON.parse(localStorage.getItem('list_items'))
    const returnState = localStorage.getItem('state_success') ? JSON.parse(localStorage.getItem('state_success')) : {}

    let elementOfList

    if (Object.keys(returnObj).length !== 0) {
        for (key in returnObj) {
            if (returnState[key] == 'true') {
                elementOfList = path(true, returnObj[key], key)
            } else {
                elementOfList = path(false, returnObj[key], key)
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

    newTask.value = ""
    newTaskIn.value = ""
    checkGauge();

})

const state = getStoredStateOrDefault({
    counter: 0
})

var newTask = document.querySelector('.input_text')
var addTaskbtn = document.querySelector('.add_task')
var newTaskIn = document.querySelector('.input_text_in_scroll')
var addTaskbtnIn = document.querySelector('.add_task_in_scroll')
var removebtn = document.querySelector('.todo_list')
const $gauge = document.querySelector('.gauge')
const btnNewDay = document.querySelector('.new_day_button')
let countToDo = document.querySelector('.count_task') // переменная для отображ-я кол-ва тасков под кольцом

let listItems = localStorage.getItem('list_items') ? JSON.parse(localStorage.getItem('list_items')) : {} // таски в базе
let countOfTask = localStorage.getItem('count') ? JSON.parse(localStorage.getItem('count')) : 0 //переменная для подсчёта тасков в базе
let id = localStorage.getItem('id_task') ? JSON.parse(localStorage.getItem('id_task')) : 0
let stateSuccess = localStorage.getItem('state_success') ? JSON.parse(localStorage.getItem('state_success')) : {}


function gaugePhotoDisplay(a, b, c, d, e) {
    document.querySelectorAll('.gauge')[0].style.display = a
    document.querySelectorAll('.new_day_screen')[0].style.display = b
    document.querySelectorAll('.all_down_screen')[0].style.display = c
    document.querySelectorAll('.count_task')[0].style.display = d
    document.querySelectorAll('.what_is')[0].style.display = e
}


function path(flag, taskValue, key) {
    var elementTodoList = document.createElement("div", )
    elementTodoList.className = "element-todo-list"
    var elementOfList = document.createElement("div")
    if (flag)
        elementOfList.className = "success element_of_list"
    else elementOfList.className = "element_of_list"
    elementOfList.id = key
    var checkboxTask = document.createElement("input")
    checkboxTask.className = "checkbox_task"
    checkboxTask.type = "checkbox"
    checkboxTask.onclick = checkTask
    checkboxTask.checked = flag
    var text = document.createElement("div")
    text.className = "textInToDo"
    text.innerText = taskValue
    var btn = document.createElement("button")
    btn.className = "delete"
    elementOfList.append(text)
    elementOfList.prepend(checkboxTask)
    elementOfList.append(btn)
    elementTodoList.append(elementOfList)
    return elementTodoList

}


removebtn.addEventListener("click", (e) => {

    if (e.target.className === 'delete') {
        e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
        countOfTask--
        localStorage.setItem('count', JSON.stringify(countOfTask))
        countToDo.textContent = countOfTask + " tasks to do"
        for (key in listItems) {
            if (key == e.target.parentElement.id) {
                console.log(e.target.parentElement)
                delete stateSuccess[key]
                delete listItems[key]
                console.log(listItems)
            }
        }
        localStorage.setItem("state_success", JSON.stringify(stateSuccess))
        localStorage.setItem('list_items', JSON.stringify(listItems))
        checkGauge()
        if (state.counter == 100) {
            gaugePhotoDisplay('none', 'none', 'block', 'none', 'block')
            newTask.value = ""
            newTaskIn.value = ""
        }
    }
})

newTask.addEventListener("keyup", (e) => {
    if (e.keyCode === 13 && inputValid(newTask)) {
        saveTask(newTask)
        gaugePhotoDisplay('block', 'none', 'none', 'block', 'none')
    }
})

addTaskbtn.addEventListener("click", (e) => {
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
    for (key in stateSuccess) {
        if (stateSuccess[key] == 'true') {
            delete stateSuccess[key]
            delete listItems[key]
            countOfTask--
        }
    }
    localStorage.setItem('count', JSON.stringify(countOfTask))
    localStorage.setItem("state_success", JSON.stringify(stateSuccess))
    localStorage.setItem('list_items', JSON.stringify(listItems))
    window.location.reload()
        //localStorage.clear()
})


function inputValid(task) {
    return (task.value !== "") && (task.value !== " ")

}

//функция для записи тасков в базу
function saveTask(task) {
    listItems[id] = task.value
    localStorage.setItem('list_items', JSON.stringify(listItems))
    addTask(task.value)
    newTask.value = ""
    newTaskIn.value = ""
}



function addTask(taskValue) {
    countOfTask++
    localStorage.setItem('count', JSON.stringify(countOfTask))
    id++
    $('.todo_list').append(path(false, taskValue, id))
    localStorage.setItem('id_task', JSON.stringify(id))

    countToDo.textContent = countOfTask + " tasks to do"
    checkGauge()
}

//функции для расчёта значений кольца
function checkGauge() {
    state.counter = Math.round(Object.keys(stateSuccess).length * 100 / countOfTask)
    saveState(state)
    setGaugePercent($gauge, state.counter)
    if (state.counter == 100) {
        gaugePhotoDisplay('none', 'none', 'block', 'none', 'block')
    }
    if (countOfTask == 0)
        gaugePhotoDisplay('none', 'block', 'none', 'none', 'block')
}



function checkTask() {
    obj = this
    if (!obj.parentElement.classList.contains('success')) {
        obj.parentElement.classList.add('success')
        stateSuccess[obj.parentElement.id] = "true"

        // obj.parentElement.parentElement.children[1].style.display = 'none'
    } else {
        for (key in stateSuccess) {
            if (key == obj.parentElement.id) {
                delete stateSuccess[key]
            }
        }
        obj.parentElement.classList.remove('success')
            //obj.parentElement.parentElement.children[1].style.display = 'block'
    }
    localStorage.setItem("state_success", JSON.stringify(stateSuccess))
    gaugePhotoDisplay('block', 'none', 'none', 'block', 'none')
    checkGauge()
    if (state.counter == 100) {
        gaugePhotoDisplay('none', 'none', 'block', 'none', 'block')
        newTask.value = ""
        newTaskIn.value = ""
    }
}