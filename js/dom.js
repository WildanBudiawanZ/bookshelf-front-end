const UNCOMPLETED_LIST_BOOKSHELF_ID = "bookshelfs";
const COMPLETED_LIST_BOOKSHELF_ID = "completed-bookshelfs";
const BOOKSHELF_ITEMID = "itemId";

function makeBookshelf(title, author, year, isCompleted) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = title;

  const textAuthor = document.createElement("h4");
  textAuthor.innerText = author + " - " + year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("caption");
  textContainer.append(textTitle, textAuthor);

  const container = document.createElement("div");
  container.classList.add("col-md-4", "shadow");
  container.append(textContainer);

  if (isCompleted) {
    container.append(createTrashButton());
    container.append(createUnfinishedButton());
  } else {
    container.append(createTrashButton());
    container.append(createFinishedButton());
  }

  return container;
}

function createUnfinishedButton() {
  return createButton(
    "unfinished-button",
    function (event) {
      addBookToUnfinished(event.target.parentElement);
    },
    "Pindahkan"
  );
}

function createTrashButton() {
  return createButton(
    "trash-button",
    function (event) {
      let result = confirm("Data buku akan dihapus. Apakah Anda yakin?");
      if (result) {
        removeBookshelfFromCompleted(event.target.parentElement);
      }
    },
    "Hapus"
  );
}

function createFinishedButton() {
  return createButton(
    "finished-button",
    function (event) {
      addBookToFinished(event.target.parentElement);
    },
    "Pindahkan"
  );
}

function createButton(buttonTypeClass, eventListener, buttonCaption) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.textContent = buttonCaption;
  button.addEventListener("click", function (event) {
    eventListener(event);
    event.stopPropagation();
  });
  return button;
}

function addBookshelf() {
  const uncompletedBookshelfList = document.getElementById(
    UNCOMPLETED_LIST_BOOKSHELF_ID
  );
  const completedBookshelfList = document.getElementById(
    COMPLETED_LIST_BOOKSHELF_ID
  );

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isCompleted = document.getElementById("isComplete").checked;

  const bookshelf = makeBookshelf(title, author, year, isCompleted);
  const BookshelfObject = composeBookshelfObject(
    title,
    author,
    year,
    isCompleted
  );

  bookshelf[BOOKSHELF_ITEMID] = BookshelfObject.id;
  bookshelfs.push(BookshelfObject);

  if (isCompleted) {
    completedBookshelfList.append(bookshelf);
  } else {
    uncompletedBookshelfList.append(bookshelf);
  }

  updateDataToStorage();
}

function addBookToFinished(taskElement /* HTMLELement */) {
  const listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);

  const title = taskElement.querySelector("div.caption > h2").innerText;

  const authorYear = taskElement.querySelector("div.caption > h4").innerText;
  const author = authorYear.split(" - ")[0];
  const year = authorYear.split(" - ")[1];

  const newBookshelf = makeBookshelf(title, author, year, true);

  const bookshelf = findBookshelf(taskElement[BOOKSHELF_ITEMID]);
  bookshelf.isCompleted = true;
  newBookshelf[BOOKSHELF_ITEMID] = bookshelf.id;

  listCompleted.append(newBookshelf);
  taskElement.remove();

  updateDataToStorage();
}

function removeBookshelfFromCompleted(taskElement /* HTMLELement */) {
  const bookshelfPosition = findBookshelfIndex(taskElement[BOOKSHELF_ITEMID]);
  bookshelfs.splice(bookshelfPosition, 1);

  taskElement.remove();
  updateDataToStorage();
}

function addBookToUnfinished(taskElement /* HTMLELement */) {
  const listUncompleted = document.getElementById(
    UNCOMPLETED_LIST_BOOKSHELF_ID
  );

  const title = taskElement.querySelector("div.caption > h2").innerText;

  const authorYear = taskElement.querySelector("div.caption > h4").innerText;
  const author = authorYear.split(" - ")[0];
  const year = authorYear.split(" - ")[1];

  const newBookshelf = makeBookshelf(title, author, year, false);

  const bookshelf = findBookshelf(taskElement[BOOKSHELF_ITEMID]);
  bookshelf.isCompleted = false;
  newBookshelf[BOOKSHELF_ITEMID] = bookshelf.id;

  listUncompleted.append(newBookshelf);
  taskElement.remove();

  updateDataToStorage();
}

function refreshDataFromBookshelfs() {
  let listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
  let listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);

  for (bookshelf of bookshelfs) {
    const newBookshelf = makeBookshelf(
      bookshelf.title,
      bookshelf.author,
      bookshelf.year,
      bookshelf.isCompleted
    );
    newBookshelf[BOOKSHELF_ITEMID] = bookshelf.id;

    if (bookshelf.isCompleted) {
      listCompleted.append(newBookshelf);
    } else {
      listUncompleted.append(newBookshelf);
    }
  }
}
