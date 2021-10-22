document.addEventListener('DOMContentLoaded', function() {
    const state = getStoredStateOrDefault({
        counter: 0
    })

    const returnObj = JSON.parse(localStorage.getItem('list_items'))
    const returnState = localStorage.getItem('state_success') ? JSON.parse(localStorage.getItem('state_success')) : {}
    let elementOfList

    window.localStorage.removeItem("state_marked");
    if (Object.keys(returnObj).length !== 0) {
        for (key in returnObj) {
            elementOfList = path(returnState[key], returnObj[key], key)
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
    countToDo.textContent = Object.keys(returnObj).length + " tasks to do"
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
var elementMarked = document.querySelector('.todo_list')
var removebtn = document.querySelector('.todo_list')
const $gauge = document.querySelector('.gauge')
const btnNewDay = document.querySelector('.new_day_button')
let countToDo = document.querySelector('.count_task') // переменная для отображ-я кол-ва тасков под кольцом

let listItems = localStorage.getItem('list_items') ? JSON.parse(localStorage.getItem('list_items')) : {} // таски в базе
let id = localStorage.getItem('id_task') ? JSON.parse(localStorage.getItem('id_task')) : 0
let stateSuccess = localStorage.getItem('state_success') ? JSON.parse(localStorage.getItem('state_success')) : {}
let stateMarked = localStorage.getItem('state_marked') ? JSON.parse(localStorage.getItem('state_marked')) : {}

function gaugePhotoDisplay(a, b, c, d, e) {
    document.querySelectorAll('.gauge')[0].style.display = a
    document.querySelectorAll('.new_day_screen')[0].style.display = b
    document.querySelectorAll('.all_down_screen')[0].style.display = c
    document.querySelectorAll('.count_task')[0].style.display = d
    document.querySelectorAll('.what_is')[0].style.display = e
}

function path(flag, taskValue, key) {
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
    var svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElem.setAttributeNS(null, "viewBox", "0 0 " + 12 + " " + 12);
    var coords = "M7.41401 6L11.707 1.707C12.098 1.316 12.098 0.683998 11.707 0.292998C11.316 -0.0980018 10.684 "
    coords += "-0.0980018 10.293 0.292998L6.00001 4.586L1.70701 0.292998C1.31601 -0.0980018 0.684006 -0.0980018 "
    coords += "0.293006 0.292998C-0.0979941 0.683998 -0.0979941 1.316 0.293006 1.707L4.58601 6L0.293006 10.293C-0.0979941 "
    coords += "10.684 -0.0979941 11.316 0.293006 11.707C0.488006 11.902 0.744006 12 1.00001 12C1.25601 12 1.51201 11.902 "
    coords += "1.70701 11.707L6.00001 7.414L10.293 11.707C10.488 11.902 10.744 12 11 12C11.256 12 11.512 11.902 11.707 "
    coords += "11.707C12.098 11.316 12.098 10.684 11.707 10.293L7.41401 6Z"
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgElem.id = "remove"
    path.id = "path"
    var btn = document.createElement("div")
    btn.className = "delete"
    btn.append(svgElem)
    path.setAttributeNS(null, 'd', coords);
    path.setAttributeNS(null, 'fill', "#A5A5A5");
    svgElem.appendChild(path);
    elementOfList.append(checkboxTask)
    elementOfList.append(text)
    elementOfList.append(btn)
    return elementOfList
}

//добавленние в список дел
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

function inputValid(task) {
    return (task.value !== "") && (task.value !== " ")

}

//новый день
btnNewDay.addEventListener("click", (e) => {
    for (key in listItems) {
        if (stateMarked[key] != true) {
            delete listItems[key]
            delete stateSuccess[key]
        }
    }
    window.localStorage.removeItem("state_marked");
    localStorage.setItem('list_items', JSON.stringify(listItems))
    localStorage.setItem("state_success", JSON.stringify(stateSuccess))
    window.location.reload()
        //localStorage.clear()
})

//маркеровка
elementMarked.addEventListener("click", (e) => {
    if (e.target.classList.contains('element_of_list')) {
        Marked(e.target)
    }
    if (e.target.classList.contains('textInToDo')) {
        Marked(e.target.parentElement)
    }
})

function Marked(Elements) {
    if (!Elements.classList.contains('marked')) {
        Elements.classList.add('marked')
        stateMarked[Elements.id] = true
        localStorage.setItem("state_marked", JSON.stringify(stateMarked))
    } else {
        delete stateMarked[Elements.id]
        Elements.classList.remove('marked')
    }
}

//функция для записи тасков в базу
function saveTask(task) {
    id++
    listItems[id] = task.value
    localStorage.setItem('list_items', JSON.stringify(listItems))
    $('.todo_list').append(path(false, task.value, id))
    localStorage.setItem('id_task', JSON.stringify(id))
    countToDo.textContent = Object.keys(listItems).length + " tasks to do"
    checkGauge()
    newTask.value = ""
    newTaskIn.value = ""
}

//удаление элемента списка
removebtn.addEventListener("click", (e) => {
    console.log(e.target)
    if (e.target.id === 'remove') {
        remove(e.target)
    }
    if (e.target.id === 'path') {
        remove(e.target.parentElement)
    }
    if (Object.keys(listItems).length == 0) {
        localStorage.clear()
        window.location.reload()
    }
})

function remove(Element) {
    Element.parentElement.parentElement.parentElement.removeChild(Element.parentElement.parentElement)
    delete stateSuccess[Element.parentElement.parentElement.id]
    delete listItems[Element.parentElement.parentElement.id]
    countToDo.textContent = Object.keys(listItems).length + " tasks to do"
    localStorage.setItem("state_success", JSON.stringify(stateSuccess))
    localStorage.setItem('list_items', JSON.stringify(listItems))
    checkGauge()
}

//функции для расчёта значений кольца
function checkGauge() {
    state.counter = Math.round(Object.keys(stateSuccess).length * 100 / Object.keys(listItems).length)
    saveState(state)
    setGaugePercent($gauge, state.counter)
    if (state.counter == 100) {
        gaugePhotoDisplay('none', 'none', 'block', 'none', 'block')
        newTask.value = ""
        newTaskIn.value = ""
    }
    if (Object.keys(listItems).length == 0) {
        gaugePhotoDisplay('none', 'block', 'none', 'none', 'block')
        newTask.value = ""
        newTaskIn.value = ""
    }
}

function checkTask() {
    obj = this
    if (!obj.parentElement.classList.contains('success')) {
        obj.parentElement.classList.add('success')
        stateSuccess[obj.parentElement.id] = true
    } else {
        delete stateSuccess[obj.parentElement.id]
        obj.parentElement.classList.remove('success')
    }
    localStorage.setItem("state_success", JSON.stringify(stateSuccess))
    gaugePhotoDisplay('block', 'none', 'none', 'block', 'none')
    checkGauge()
}