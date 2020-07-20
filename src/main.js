/**SHOWS AND HIDES THE BUTTONS  */
const loggedOut = document.querySelectorAll('.logged-out');
const loggedIn = document.querySelectorAll('.logged-in');

/**USER TAKEN FROM THE EVENT-AUTH */
const loginCheck = user => {
    if (user) {
        loggedIn.forEach(link => link.style.display = 'block');
        loggedOut.forEach(link => link.style.display = 'none');
    } else {
        loggedIn.forEach(link => link.style.display = 'none');
        loggedOut.forEach(link => link.style.display = 'block');
    }
}

/**SIGNUP*/
const authForm = document.querySelector('#signup-form');

authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = authForm['signup-email'].value;
    const pass = authForm['signup-pass'].value;

    /**auth VALIDATE CREDENTIALS*/
    auth.createUserWithEmailAndPassword(email, pass)
        .then(userCredential => {

            authForm.reset();
            $('#signupModal').modal('hide'); //HIDE THO MODAL

            console.log('sign up');
        });
});

/**SIGNIN*/
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginForm['login-email'].value;
    const pass = loginForm['login-pass'].value;

    /**auth GET THE CREDENTIALS AND VALIDATED*/
    auth.signInWithEmailAndPassword(email, pass)
        .then(userCredential => {

            loginForm.reset();
            $('#signinModal').modal('hide'); //HIDE THO MODAL

            console.log('sign in');
        });
});

/**LOGOUT */
const logOut = document.querySelector('#logout');

logOut.addEventListener('click', (e) => {
    e.preventDefault();
    /**METHOD THAT ALLOWS LOGOUT*/
    auth.signOut().then(() => {
        console.log('sign out');
    });
});

/**GOOGLE LOGIN */
const btnGoogle = document.querySelector('#btn-google');
btnGoogle.addEventListener('click', (e) => {
    e.preventDefault();
    $("#signinModal").modal("hide");

    const provider = new firebase.auth.GoogleAuthProvider(); //REQUEST TO AUTHENTICATE WITH GOOGLE 
    auth.signInWithPopup(provider).then((result) => { //SHOWS A WINDOW TO TRY SELECT A GOOGLE ACCOUNT
            console.log(result);
            console.log('google sign in');
        })
        .catch(err => {
            console.log(err);
        })
});

/**FACEBOOK LOGIN */
const btnFacebook = document.querySelector('#btn-facebook');
btnFacebook.addEventListener('click', e => {
    e.preventDefault();
    $("#signinModal").modal("hide");

    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider).then(result => {
            console.log(result);
            console.log('facebook sign in');
        })
        .catch(err => {
            console.log(err);
        })
});

/**POSTS */
const postList = document.querySelector('.posts');
const setupPosts = data => {
    if (data.length) {
        let html = '';
        data.forEach(doc => {
            const post = doc.data();
            const li = `
            <li class="list-group-item list-group-item-action mt-3">
                <h5>${post.title}</h5>
                <p>${post.description}</p>
            </li>`;
            html += li; /**ADDS A LIST FOR EVERY COLLECTION TO HTML*/
        });
        postList.innerHTML = html; /**PRINT IN THE DOCUMENT*/
    } else {
        postList.innerHTML = '<p class="text-center">Login to see Posts</p>'
    }
}

/**EVENTS IF USER IS AUTH */
auth.onAuthStateChanged(user => {
    if (user) {
        firestore.collection('posts')
            .get()
            .then((snapshot) => { /**snapshot STORES CHANGING DATA */
                setupPosts(snapshot.docs); /**GETS THE LIST OF EXISTING COLLECTIONS*/
                loginCheck(user); /**CALLS THE FUNCTION TO VERIFY IF THE USER IS SIGNING IN*/
            });
    } else {
        setupPosts([]); /**EMPTY ARRANGEMENT*/
        loginCheck(user);
    }
})