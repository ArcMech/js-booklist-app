//Book Class: Represents a book

class Book {
  constructor(title, author, ISBN) {
    this.title = title;
    this.author = author;
    this.ISBN = ISBN;
  }
}

// UI Class: Handle UI Tasks

class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.ISBN}</td>
        <td><a href = "#" class = "btn btn-danger btn-sm delete">X</a></td>
        `;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(messege, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(messege));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#ISBN").value = "";
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(ISBN) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.ISBN === ISBN) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
// Event: Display Books

document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book

document.querySelector("#book-form").addEventListener("submit", e => {
  e.preventDefault();

  // Show success

  UI.showAlert("Book added successfully", "success");

  //Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const ISBN = document.querySelector("#ISBN").value;

  // Validate
  if (title === "" || author === "" || ISBN === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instatiate book

    const book = new Book(title, author, ISBN);

    // Add Book to UI
    UI.addBookToList(book);

    // Add Book to Store
    Store.addBook(book);

    //Clear fields

    UI.clearFields();
  }
});

// Event: Remove book

document.querySelector("#book-list").addEventListener("click", e => {
  // Remove Book from UI
  UI.deleteBook(e.target);

  //Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show delete alert
  UI.showAlert("Book removed successfully", "info");
});

// Read about static
// I can't store object. Before sending it to local storage I have to
// stringify it
