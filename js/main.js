class Todo extends Widget {

    constructor(todoSelector){
        super();
        this.selector = todoSelector;
    }

    onWidgetInit() {
        this.wrapper = document.querySelector(this.selector);

        this.blockAddUser = this.wrapper.querySelector(".add-user");
        this.userName = this.blockAddUser.querySelector(".user-name");
        this.btnAddUser = this.blockAddUser.querySelector(".btn-add-user");
        this.userList = this.blockAddUser.querySelector(".user-list ul");

        this.blockAddNote = this.wrapper.querySelector(".add-note");
        this.notesList = this.blockAddNote.querySelector(".notes-list ul");
        this.titleNote = this.blockAddNote.querySelector(".title-note");
        this.textNote = this.blockAddNote.querySelector(".text-note");
        this.btnAddNote = this.blockAddNote.querySelector(".btn-add-note");

        this.blockViewNote = this.wrapper.querySelector(".view-note");
        this.viewTitleNote = this.blockViewNote.querySelector(".title-note");
        this.viewTextNote = this.blockViewNote.querySelector(".text-note");
    }

    onWidgetStartWork() {
        this.updateUsers();
        this.btnAddUser.addEventListener("click", ()=> this.addUser());
        this.btnAddNote.addEventListener("click", (e)=> {
            let id = e.target.dataset.id;
            this.addNote(id);
        });
        this.wrapper.addEventListener("click", (e)=> {
            let id = e.target.dataset.id;

            if(e.target.classList.contains('btn-delete-user')) {
                this.deleteUser(id);
            }
            else if(e.target.classList.contains('view-user-notes')) {
                this.blockAddUser.classList.toggle('active');
                this.blockAddNote.classList.toggle('active');
                this.btnAddNote.setAttribute('data-id', id);
                this.updateNotes(id);
            }
            else if(e.target.classList.contains('delete-note')) {
                let idUser = this.blockAddNote.dataset.user;
                this.deleteNote(id, idUser);
            }
            else if(e.target.classList.contains('open-note')) {
                this.blockAddNote.classList.toggle('active');
                this.blockViewNote.classList.toggle('active');
                let idUser = this.blockAddNote.dataset.user;
                this.viewNote(id, idUser);
            }
        });
    }

    updateUsers() {
        AJAX.get("http://pdfstep.zzz.com.ua?action=user&method=getAll", (status, body)=> {
            let response = JSON.parse(body);
            let users = response.data;
            this.drawUsers(users);
        });
    }

    drawUsers(users) {
        this.userList.innerHTML = "";
        let list = "";
        users.forEach((u) => {
            list += `<li>
                        <div>
                            ${u.name}
                        </div>
                        <div class="buttons">
                            <div class="btn-delete btn-delete-user" data-id="${u.id}">
                            </div>
                            <div class="btn-open view-user-notes" data-id="${u.id}">
                            </div>
                        </div>
                    </li>`
        });

        this.userList.innerHTML = list;
    }

    addUser() {
        let name = this.userName.value;
        if(name.length < 1) {
            alert("Введите имя пользователя");
        }
        else {
            AJAX.post("http://pdfstep.zzz.com.ua?action=user&method=add", {name: name}, (status, body)=> {
                let response = JSON.parse(body);
                if(response.status == "error") {
                    alert(response.errors);
                }
                else {
                    this.userName.value = "";
                }
                this.updateUsers();
            });
        }
    }

    deleteUser(id) {
        AJAX.post("http://pdfstep.zzz.com.ua?action=user&method=del", {id: id}, (status, body)=> {
            let response = JSON.parse(body);
            if(response.status == "error") {
                alert(response.errors);
            }

            this.updateUsers();
        });
    }

    updateNotes(id) {
        this.blockAddNote.setAttribute('data-user', id);
        AJAX.post("http://pdfstep.zzz.com.ua?action=todo&method=get", {id: id}, (status, body)=> {
            let response = JSON.parse(body);
            let notes = response.data;
            this.drawNotes(notes);
        });
    }

    drawNotes(notes) {
        this.notesList.innerHTML = "";
        let list = "";
        notes.forEach((n) => {
            list += `<li>
                        <div>
                            ${n.name}
                        </div>
                        <div class="buttons">
                            <div class="btn-delete delete-note" data-id="${n.id}">
                            </div>
                            <div class="btn-open open-note" data-id="${n.id}">
                            </div>
                        </div>
                    </li>`
        });

        this.notesList.innerHTML = list;
    }

    addNote(id) {
        let name = this.titleNote.value;
        let desc = this.textNote.value;
        if(name.length < 1 || desc.length < 1) {
            alert("Заполните все поля");
        }
        else {
            AJAX.post("http://pdfstep.zzz.com.ua?action=todo&method=add", {id: id, name: name, desc: desc}, (status, body)=> {
                let response = JSON.parse(body);
                if(response.status == "error") {
                    alert(response.errors);
                }
                else {
                    this.titleNote.value = "";
                    this.textNote.value = "";
                }
                this.updateNotes(id);
            });
        }
    }

    deleteNote(id, idUser) {
        AJAX.post("http://pdfstep.zzz.com.ua?action=todo&method=delete", {id: id}, (status, body)=> {
            let response = JSON.parse(body);
            if(response.status == "error") {
                alert(response.errors);
            }
            this.updateNotes(idUser);
        });
    }

        viewNote(id, idUser) {
            AJAX.post("http://pdfstep.zzz.com.ua?action=todo&method=get", {id: idUser}, (status, body)=> {
                let response = JSON.parse(body);
                if(response.status == "error") {
                    alert(response.errors);
                }
                else {
                    response.data.forEach((n) => {
                        if(n['id'] === id) {
                            this.viewTitleNote.innerText = n['name'];
                            this.viewTextNote.innerText = n['desc'];
                        };
                    });
                }
            });
        }
}