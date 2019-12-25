const TODO_ITEM_DATA_NAME = 'todoItemContainer';
const TODO_ITEM_CONTAINER_ID = 'todoItemContainer';
const TODO_DESCRIPTION_ID = 'todoDescription';
const TODO_LIST_WRAPPER_ID = 'todoListWrapper';
const TODO_CHECK_BOX_ID = 'todoCheckBox';
const TODO_ADD_TEXT_BOX_ID = 'todoAddTextBox';
const TODO_EDIT_TEXT_BOX_ID = 'todoEditTextBox';
const TODO_DELETE_SELECTED_ACTION_TYPE = 'deleteSelected';
const TODO_MARK_SELECTED_ACTION_TYPE = 'markSelected';


const MULTI_SELECT_ACTION_HANDLER_FUNCTION_MAP = {
    [TODO_DELETE_SELECTED_ACTION_TYPE] : deleteSelectedTodoItems,
    [TODO_MARK_SELECTED_ACTION_TYPE] : markSelectedTodoItems,
}

function clearInputField() {
    document.getElementById(TODO_ADD_TEXT_BOX_ID).value = "";
}  

function strikeTodoItem(element) {
    element.classList.toggle('strikeThrough');
}

function findClosestParent(element, dataitem) {
    let currentParent = element.parentNode;
    while(currentParent) {
        if(Object.values(currentParent.dataset).includes(dataitem)) return currentParent;
        currentParent = currentParent.parentNode;
    }
}

function createTodoItem(todoDescription) {
    const clonedTodoItem = document.getElementById(TODO_ITEM_CONTAINER_ID).cloneNode(true);
    clonedTodoItem.setAttribute('id', Date.now());
    clonedTodoItem.setAttribute('data-name', TODO_ITEM_DATA_NAME); /////should know meaning
    clonedTodoItem.querySelector(`#${TODO_DESCRIPTION_ID}`).innerHTML = todoDescription;
    clonedTodoItem.classList.remove('todoItemTemplate');
    return clonedTodoItem;
}

function addItem() {
    const todoDescription = document.getElementById(TODO_ADD_TEXT_BOX_ID).value.trim();
    if(!todoDescription) return alert('Enter the Task');
    const todoListWrapperElement = document.getElementById(TODO_LIST_WRAPPER_ID);
    todoListWrapperElement.prepend(createTodoItem(todoDescription)); 
    clearInputField();
}
    
function todoTextBoxKeyDownHandler(event) {
    if(event.code === "Enter") {
        addItem();
    }
}

function multiSelectActionHandler(actionType) {
    const todoListWrapperElement = document.getElementById(TODO_LIST_WRAPPER_ID);
    const todoListItemElements = todoListWrapperElement.querySelectorAll(`[data-name = ${TODO_ITEM_DATA_NAME}]`);
    todoListItemElements.forEach(function actionHandler(todoItemElement) {
        const todoCheckBox = todoItemElement.querySelector(`#${TODO_CHECK_BOX_ID}`);
        if(todoCheckBox.checked) {
            const funcToExec = MULTI_SELECT_ACTION_HANDLER_FUNCTION_MAP[actionType];
            funcToExec(todoItemElement, todoListWrapperElement);
        }
    });
}

function deleteSelectedTodoItems(todoItemElement, todoListWrapperElement) {
    todoListWrapperElement.removeChild(todoItemElement);
}

function markSelectedTodoItems(todoItemElement) {
    strikeTodoItem(todoItemElement.querySelector(`#${TODO_DESCRIPTION_ID}`));
}

function deleteTodoItem(event) {
    document.getElementById(TODO_LIST_WRAPPER_ID).removeChild(findClosestParent(event.target, TODO_ITEM_DATA_NAME));
}

function todoItemMarkComplete(event) {
    const todoItemContainerElement = findClosestParent(event.target, TODO_ITEM_DATA_NAME);
    strikeTodoItem(todoItemContainerElement.querySelector(`#${TODO_DESCRIPTION_ID}`));
}

function selectAndDeselectAll(event) {
    const todoListWrapperElement = document.getElementById(TODO_LIST_WRAPPER_ID);
    const todoCheckBoxElements = todoListWrapperElement.querySelectorAll(`#${TODO_CHECK_BOX_ID}`);
    todoCheckBoxElements.forEach(function checkTodo (checkboxElement) {
        checkboxElement.checked = event.target.checked;
    }); 
}

function saveTodoItemDescription(event) {   
     if(event.code === 'Enter') {
        const todoItemContainerElement = findClosestParent(event.target, TODO_ITEM_DATA_NAME);
        todoItemContainerElement.replaceWith(createTodoItem(event.target.value));
     }
}

function createInputField(todoDescription) {
    const inputFieldElement =  document.createElement('input');
    inputFieldElement.setAttribute('type' , 'text');
    inputFieldElement.setAttribute('class', 'addTaskTextbox');
    inputFieldElement.setAttribute('id', TODO_EDIT_TEXT_BOX_ID);
    inputFieldElement.setAttribute('value', todoDescription);
    inputFieldElement.addEventListener('keydown', saveTodoItemDescription);
    return inputFieldElement;
}

function editTodoItem(event) {
    const todoListWrapperElement = findClosestParent(event.target, TODO_ITEM_DATA_NAME);
    const todoDescriptionElement = todoListWrapperElement.querySelector(`#${TODO_DESCRIPTION_ID}`);
    const todoDescription = todoDescriptionElement.innerHTML;
    const inputFieldElement = createInputField(todoDescription);
    todoDescriptionElement.replaceWith(inputFieldElement);
    todoListWrapperElement.querySelector(`#${TODO_EDIT_TEXT_BOX_ID}`).focus();
    todoListWrapperElement.querySelector('#todoCheckBox').style.display = 'none';
    todoListWrapperElement.querySelector('#editIcon').style.display = 'none';
    todoListWrapperElement.querySelector('#deleteIcon').style.display = 'none';
    todoListWrapperElement.querySelector('#strikeThrough').style.display = 'none';
}

function onTodoItemDragStart(event) {
    event.dataTransfer.setData("TodoItemId", event.target.id);
    event.target.style.backgroundColor = '#0000001a';
}

function onTodoItemDragOver() {
    event.preventDefault();
}

function onTodoItemDrop(event) {
    event.preventDefault();
    const todoListWrapperElement = document.getElementById(TODO_LIST_WRAPPER_ID);
    const TodoItemId = event.dataTransfer.getData("TodoItemId");
    const targetElementToReplace = findClosestParent(event.target, TODO_ITEM_DATA_NAME);
    const targetElementToReplaceWith = document.getElementById(TodoItemId);
    setTimeout(() => targetElementToReplaceWith.style.backgroundColor = 'white', 600);
    todoListWrapperElement.insertBefore(targetElementToReplaceWith, targetElementToReplace);
}


// function markAllComplete(){
//     const todoListWrapperElement = document.getElementById(TODO_LIST_WRAPPER_ID);
//     const todoDescriptionElements =  todoListWrapperElement.querySelectorAll(`#${TODO_DESCRIPTION_ID}`);
//     todoDescriptionElements.forEach(strikeTodoItem);
// }

// function deleteAllItems(){
//     document.getElementById(TODO_LIST_WRAPPER_ID).innerHTML = '';
// }
