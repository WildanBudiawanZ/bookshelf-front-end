const UNCOMPLETED_LIST_BOOKSHELF_ID = "bookshelfs";
const COMPLETED_LIST_BOOKSHELF_ID = "completed-bookshelfs";
const BOOKSHELF_ITEMID = "itemId";

function makeBookshelf(title, author, year, isCompleted) {

    const textTitle = document.createElement("h2");
    textTitle.innerText = title;

    const textAuthor = document.createElement("h4");
    textAuthor.innerText = author + " (" + year + ")";

    const textContainer = document.createElement("div");
    textContainer.classList.add("caption")
    textContainer.append(textTitle, textAuthor);

    const container = document.createElement("div");
    container.classList.add("col-md-4","shadow")
    container.append(textContainer);


    if (isCompleted) {
        container.append(
            createTrashButton()
        );
    } else {
        container.append(
            createTrashButton()
        );
    }

    return container;

}

function createUndoButton() {
    return createButton("undo-button", function (event) {
        undoTaskFromCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return createButton("trash-button", function (event) {
        removeBookshelfFromCompleted(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function (event) {
        addTaskToCompleted(event.target.parentElement);
    });
}

function createButton(buttonTypeClass /* string */, eventListener /* Event */) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function addBookshelf() {
    const uncompletedBookshelfList = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
    
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const isCompleted = document.getElementById("isComplete").checked;

    const bookshelf = makeBookshelf(title, author, year, isCompleted);
    const BookshelfObject = composeBookshelfObject(title, author, year, isCompleted);
    
    bookshelf[BOOKSHELF_ITEMID] = BookshelfObject.id;
    bookshelfs.push(BookshelfObject);

    uncompletedBookshelfList.append(bookshelf);
    updateDataToStorage();

}

function addTaskToCompleted(taskElement /* HTMLELement */) {
    const listCompleted = document.getElementById(COMPLETED_LIST_TODO_ID);
    const taskTitle = taskElement.querySelector(".inner > h2").innerText;
    const taskTimestamp = taskElement.querySelector(".inner > p").innerText;

    const newTodo = makeTodo(taskTitle, taskTimestamp, true);
    

    const todo = findTodo(taskElement[TODO_ITEMID]);
    todo.isCompleted = true;
    newTodo[TODO_ITEMID] = todo.id;

    listCompleted.append(newTodo);
    taskElement.remove();

    updateDataToStorage();
}

function removeBookshelfFromCompleted(taskElement /* HTMLELement */) {

    const bookshelfPosition = findBookshelfIndex(taskElement[BOOKSHELF_ITEMID]);
    bookshelfs.splice(bookshelfPosition, 1);

    taskElement.remove();
    updateDataToStorage();
}

function undoTaskFromCompleted(taskElement /* HTMLELement */) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_TODO_ID);
    const taskTitle = taskElement.querySelector(".inner > h2").innerText;
    const taskTimestamp = taskElement.querySelector(".inner > p").innerText;
    
    const newTodo = makeTodo(taskTitle, taskTimestamp, false);

    const todo = findTodo(taskElement[TODO_ITEMID]);
    todo.isCompleted = false;
    newTodo[TODO_ITEMID] = todo.id;

    listUncompleted.append(newTodo);
    taskElement.remove();
    
    updateDataToStorage();
}

function refreshDataFromBookshelfs() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);

    for(bookshelf of bookshelfs){
        const newBookshelf = makeBookshelf(bookshelf.title, bookshelf.author, bookshelf.year, bookshelf.isCompleted);
        newBookshelf[BOOKSHELF_ITEMID] = bookshelf.id;

        if(bookshelf.isCompleted){
            listCompleted.append(newBookshelf);
        } else {
            listUncompleted.append(newBookshelf);
        }
    }
}