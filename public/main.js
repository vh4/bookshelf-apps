(() => {
	const EVEN_RENDER = "RENDER_EVENT"
	const bookshelf = [];

    const SAVED_EVENT = 'saved-bookself';
    const STORAGE_KEY = 'BOOKSHELF_APPS';

	document.addEventListener(EVEN_RENDER, () => {
		const uncompletedRead = document.getElementById("incompleteBookshelfList")
		uncompletedRead.innerHTML = ''

		const completedRead = document.getElementById("completeBookshelfList")
		completedRead.innerHTML = ''

		for (const books of bookshelf) {
			const bookElement = makeBook(books)
            if(!books.isComplete) {
                uncompletedRead.append(bookElement)
            }
            else{
                completedRead.append(bookElement)
            }
		}
	});

	document.addEventListener('DOMContentLoaded', () => {
		const formSubmit = document.getElementById('inputBook')
		formSubmit.addEventListener('submit', (e) => {
			e.preventDefault(), addBooks()
		})

        const searchBook = document.getElementById("searchBook")
        searchBook.addEventListener('submit', (e) =>{
          e.preventDefault()
          const searchBookTitle = document.getElementById("searchBookTitle").value
          FilterBooks(searchBookTitle)
        })

        if (isStorageExist()) {
            loadDataFromStorage();
          }
	})

    function FilterBooks(Title){
        const query = Title ? bookshelf.filter(function(e){return e.title.toLowerCase().includes(Title.toLowerCase())}) : bookshelf
        
        const uncompletedRead = document.getElementById("incompleteBookshelfList")
		uncompletedRead.innerHTML = ''

		const completedRead = document.getElementById("completeBookshelfList")
		completedRead.innerHTML = ''
        
        for (const books of query) {
			const bookElement = makeBook(books)
            if(!books.isComplete) {
                uncompletedRead.append(bookElement)
            }
            else{
                completedRead.append(bookElement)
            }
		}
    }

    
	function addBooks() {
		const inputBookTitle = document.getElementById('inputBookTitle').value,
			inputBookAuthor = document.getElementById('inputBookAuthor').value,
			inputBookYear = document.getElementById('inputBookYear').value,
			inputBookIsComplete = document.getElementById('inputBookIsComplete').checked,
			dataBooks = {
				id: +new Date(),
				title: inputBookTitle,
				author: inputBookAuthor,
				year: inputBookYear,
				isComplete: inputBookIsComplete
			}
		bookshelf.push(dataBooks), document.dispatchEvent(new Event(EVEN_RENDER)), saveData();
	}

    function makeBook(bookObj){

        const articleElement = document.createElement("article");
        articleElement.classList.add("book_item");
        const titleElement = document.createElement("h2");
        titleElement.innerText = bookObj.title;
        const authorElement = document.createElement("p");
        authorElement.innerText = "Penulis: " + bookObj.author;
        const yearElement = document.createElement("p");
        yearElement.innerText = "Tahun: " + bookObj.year;

        const divAction = document.createElement('div')
        divAction.classList.add('action')
        const buttonIsReadCompleted = document.createElement('button')
        buttonIsReadCompleted.classList.add('green')
        buttonIsReadCompleted.setAttribute('id', `books-${bookObj.id}`);

        const buttonDelete = document.createElement('button')
        buttonDelete.classList.add('red')
        buttonDelete.setAttribute('id', `books-${bookObj.id}`);

        divAction.append(buttonIsReadCompleted, buttonDelete)
        articleElement.append(titleElement, authorElement, yearElement, divAction)

        if(bookObj.isComplete){
            buttonIsReadCompleted.innerText = 'Belum Selesai dibaca'
            buttonIsReadCompleted.addEventListener('click', ()=>{
                unCompleted(bookObj.id)
            })
        }
        else{
            buttonIsReadCompleted.innerText = 'Selesai dibaca'
            buttonIsReadCompleted.addEventListener('click', () =>{
                Completed(bookObj.id)
            })
        }

        buttonDelete.innerText = 'Hapus Buku'
        buttonDelete.addEventListener('click', ()=>{
            deleteBooks(bookObj.id)
        })

        return articleElement

    }

    function Completed(booksId){

        for(const booksItems of bookshelf){
            if(booksItems.id === booksId){
                booksItems.isComplete = true
                break
            }
        }
        document.dispatchEvent(new Event(EVEN_RENDER));
        saveData();
    }

    function unCompleted(booksId){
        for(const booksItems of bookshelf){
            if(booksItems.id === booksId){
                booksItems.isComplete = false
                break
            }
        }
        document.dispatchEvent(new Event(EVEN_RENDER));
        saveData();
    }

    function deleteBooks(booksId){
        for(const index in bookshelf){
            if(bookshelf[index].id = booksId){
                bookshelf.splice(index, 1)
            }

        }
        document.dispatchEvent(new Event(EVEN_RENDER));
        saveData();
    }

    function saveData(){
        if(isStorageExist()){
            const parsedData = JSON.stringify(bookshelf)
            localStorage.setItem(STORAGE_KEY, parsedData)
            document.dispatchEvent(new Event(SAVED_EVENT));

        }
    }

    function loadDataFromStorage(){
        const serializedData = localStorage.getItem(STORAGE_KEY)
        let data = JSON.parse(serializedData);

        if (data !== null) {
            for (const books of data) {
              bookshelf.push(books);
            }
          }
         
          document.dispatchEvent(new Event(EVEN_RENDER));

    }

    function isStorageExist() /* boolean */ {
        if (typeof (Storage) === undefined) {
          alert('Browser kamu tidak mendukung local storage');
          return false;
        }
        return true;
      }

})();

