const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");


// variables
let editElement;
let editFlag = false;
let editID = "";

// Event Listeners
// submit form

form.addEventListener("submit", addItem);
// clear items
clearBtn.addEventListener('click', clearItems)
// load items
window.addEventListener('DOMContentLoaded', setupItems);

const deleteBtn = document.querySelector('.delete-btn');
console.log(deleteBtn);


function addItem(e) {
    e.preventDefault(); //stops default form behaviour
    const value = grocery.value; // input from grocery input
    const id = new Date().getTime().toString();
    console.log(id);

    if (value && !editFlag) {
        createListItem(id, value);
        displayAlert('Item added to the list', 'success');
        container.classList.add("show-container");
        addToLocalStorage(id, value);
        setBackToDefault();

    }
    else if (value && editFlag) {
        console.log("editing");
        editElement.innerHTML = value;
        displayAlert('value changed', 'success');
        // edit local storage 
        editLocalStorage(editID, value)
        setBackToDefault()
    }
    else {
        console.log("empty value");
        displayAlert('please enter value', 'danger')
    }
}

function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    alert.classList.add('alert-show');

    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
        alert.classList.remove('alert-show');
    }, 1000);
}

// Clear Items function
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");

    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        })
    }

    container.classList.remove('show-container');
    displayAlert('List has been cleared', 'sucess');
    setBackToDefault();
    localStorage.removeItem('list');
}

// delete function
function deleteItem(e) {
    console.log('Item deleted');
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove("show-container");
    }
    displayAlert('item removed', 'danger');
    setBackToDefault();
    removeFromLocalStorage(id);

}
function editItem(e) {
    console.log('Item edit');
    const element = e.currentTarget.parentElement.parentElement;
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value 
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
    console.log(submitBtn.textContent)
}


function setBackToDefault() {
    console.log('Set back to default');
    grocery.value = '';
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

//Local storage

function addToLocalStorage(id, value) {
    console.log("added to local storage");
    const grocery = { id, value };
    let items = getLocalStorage();
    console.log(grocery);
    console.log(items);

    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items))

}

function removeFromLocalStorage(id) {
    console.log(id)
    let items = getLocalStorage();
    console.log(items)
    items = items.filter(function (item) {
        if (item.id !== id) {
            console.log(item)
            return (item)
        }
    })
    localStorage.setItem('list', JSON.stringify(items))

}
function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items))

}
function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}

//Local storage


function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value)
        })
        container.classList.add('show-container')

    }
}

function createListItem(id, value) {
    const element = document.createElement('article');
    // add class 
    element.classList.add('grocery-item');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button type="button" class="delete-btn">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>`;

    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');

    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);


    list.appendChild(element);

}