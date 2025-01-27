const firstNameInput = document.getElementById("firstNameInput");

const latNameInput = document.getElementById("lastNameInput");

const eMailInput = document.getElementById("emailInput");

const departmentInput = document.getElementById("departmentInput");

const addBtn = document.getElementById("addBtn");

const updateBtn = document.getElementById("updateBtn");

const responseText = document.getElementById("responseText");

const usersListContainer = document.getElementById("usersListContainer");

const requiredFirstName = document.getElementById("requiredFirstName");

const requiredLastName = document.getElementById("requiredLastName");
const requiredEmail = document.getElementById("requiredEmail");

const requiredDepartment = document.getElementById("requiredDepartment");

updateBtn.classList.add("hide-btn");

let usersList = "";
let newUser = {};


//creating list items
function createListItem(eachItem) {


    const listItem = document.createElement("li");
    listItem.classList.add("list-item");

    const id = document.createElement("p");
    id.textContent = `Id: ${eachItem.id}`;

    const firstName = document.createElement("p");
    firstName.textContent = `FirstName: ${eachItem.name}`;

    const lastName = document.createElement("p");
    lastName.textContent = `LastName: ${eachItem.username}`;


    const email = document.createElement("p");
    email.textContent = `Email: ${eachItem.email}`;


    const department = document.createElement("p");
    department.textContent = `Department: ${eachItem.company.bs}`;

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => { userUpdate(eachItem); });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("del-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => { userDelete(eachItem.id); });

    listItem.append(id, firstName, lastName, email, department, editBtn, deleteBtn);
    usersListContainer.appendChild(listItem);
}


//displaying all list itels
async function displayUsersList(itemId) {

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users", { method: "GET" });
        const jsondata = await response.json();
        usersList = jsondata;

    }
    catch (e) {
        console.log(e.message);

    }

    usersList.map(eachItem => {
        if (eachItem.id !== itemId) {
            createListItem(eachItem);
        }
    });

    responseText.textContent = "";
}
displayUsersList();


//form validation functionality
function formValidation() {
    // validation form data
    let isValidFirstName = false;
    let isValidLastName = false;
    let isValidEmail = false;
    let isValidDepartment = false;

    if (firstNameInput.value === "") {
        requiredFirstName.classList.add("display-required");
    }
    else {
        requiredFirstName.classList.remove("display-required");
        isValidFirstName = true;
    }


    if (latNameInput.value === "") {
        requiredLastName.classList.add("display-required");
    }
    else {
        requiredLastName.classList.remove("display-required");
        isValidLastName = true;
    }

    if (eMailInput.value === "") {

        requiredEmail.classList.add("display-required");
    }
    else {
        requiredEmail.classList.remove("display-required");
        isValidEmail = true;
    }


    if (departmentInput.value === "") {
        requiredDepartment.classList.add("display-required");
    }
    else {
        requiredDepartment.classList.remove("display-required");
        isValidDepartment = true;
    }


    if (isValidFirstName && isValidLastName && isValidEmail && isValidDepartment) {

        return true;
    }
}


//getting data after validation from form
function formInput() {

    const isValidData = formValidation();

    if (isValidData) {

        userData = {
            name: `${firstNameInput.value}`,
            username: `${latNameInput.value}`,
            email: `${eMailInput.value}`,
            department: `${departmentInput.value}`,
        }

        firstNameInput.value = "";
        latNameInput.value = ""
        eMailInput.value = "";
        departmentInput.value = "";

    }

    return userData;
}


//add user
async function addUser() {

    responseText.textContent = "";

    if (formValidation()) {
        const userData = formInput();

        // posting data to api
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData),
        };

        responseText.textContent = "please wait...";
        responseText.classList.add("response-text");

        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users", options);
            const jsondata = await response.json();
            const newUserItem = jsondata;

            if (response.status === 201) {
                responseText.textContent = "successfully created";
                responseText.classList.add("response-text");
                responseText.classList.add("success");
            }
            else {
                responseText.textContent = "not created";
                responseText.classList.add("response-text");
                responseText.classList.add("not-success");
            }
        }
        catch (e) {
            console.log(e.message);

        }

        usersListContainer.textContent = "";
        displayUsersList();
    }
}


addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    addUser();
});


//user update functionality
function userUpdate(eachItem) {

    responseText.textContent = "";
    usersListContainer.textContent = ""
    displayUsersList(eachItem.id);

    firstNameInput.value = `${eachItem.name}`;
    latNameInput.value = `${eachItem.username}`;
    eMailInput.value = `${eachItem.email}`;
    departmentInput.value = `${eachItem.company.bs}`;
    addBtn.classList.add("hide-btn");
    updateBtn.classList.remove("hide-btn");

    requiredFirstName.classList.remove("display-required");
    requiredLastName.classList.remove("display-required");
    requiredEmail.classList.remove("display-required");
    requiredDepartment.classList.remove("display-required");


    updateBtn.addEventListener("click", async (event) => {

        event.preventDefault();

        if (formValidation() === true) {

            const userEditedData = formInput();

            let options = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userEditedData),
            }

            responseText.textContent = "please wait...";
            responseText.classList.add("response-text");

            try {

                const response = await fetch(`https://jsonplaceholder.typicode.com/users/${eachItem.id}`, options);
                if (response.status === 200) {

                    responseText.textContent = "successfully updated";
                    responseText.classList.add("response-text");
                    responseText.classList.add("success");

                    requiredFirstName.classList.remove("display-required");
                    requiredLastName.classList.remove("display-required");
                    requiredEmail.classList.remove("display-required");
                    requiredDepartment.classList.remove("display-required");

                    updateBtn.classList.add("hide-btn");
                    addBtn.classList.remove("hide-btn");

                    usersListContainer.textContent = "";
                    displayUsersList();

                }

                else {
                    responseText.textContent = "not updated";
                    responseText.classList.add("response-text");
                    responseText.classList.add("not-success");
                    updateBtn.classList.remove("hide-btn");
                }

            }
            catch (e) {

                console.log(e.message);

            }

            firstNameInput.value = "";
            latNameInput.value = "";
            eMailInput.value = "";
            departmentInput.value = "";

        }

    });

}


//delete user functionality
async function userDelete(listItemId) {

    responseText.textContent = "";

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${listItemId}`, { method: "DELETE" });
        if (response.status === 200) {
            responseText.textContent = "succesfully deleted";
            responseText.classList.add("response-text");
        }

    }
    catch (e) {
        console.log(e.message);
        responseText.textContent = "not deleted";
        responseText.classList.add("response-text");
        responseText.classList.add("not-success");

    }
}



