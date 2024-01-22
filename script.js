// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqS9JH9Pakx3-b6QlcJMML9ug4iGquqxo",
  authDomain: "oluwafemifirebase.firebaseapp.com",
  databaseURL: "https://oluwafemifirebase-default-rtdb.firebaseio.com",
  projectId: "oluwafemifirebase",
  storageBucket: "oluwafemifirebase.appspot.com",
  messagingSenderId: "750147904443",
  appId: "1:750147904443:web:4a4d0214dd46dacabb9a9e"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let database = firebase.database();
let ref = firebase.database().ref();
//return input value
function getFormInput(id) {
  return document.getElementById(id).value;
}

function generateId() {
  const id = "uuid_" + (String(Math.floor(Math.random() * 10000)));
  console.log(id)
  return id;
}


function postToFirebase(firstName, lastName, email, dob, password) {
  firebase.database().ref('users/' + generateId()).set({
    firstName: firstName,
      lastName: lastName,
      dob: dob,
      email: email,
      password: password
  });
}

//function to callback for click event
function submitForm(event) {
  event.preventDefault();
  
    firstName = getFormInput("firstName"),
    lastName = getFormInput("lastName"),
    dob = getFormInput("dob"),
    email = getFormInput("email"),
    password = getFormInput("password")
 
  postToFirebase(firstName, lastName, email, dob, password);



}

//Register functionality
const remail = document.getElementById("email");
const rpassword = document.getElementById("password");
const btnSignUp = document.getElementById("signup");
//Add an event handler to Register button

btnSignUp?.addEventListener('click', e => {
  e.preventDefault();

  submitForm(e)


  // read values on button click

  const email = remail.value;
  const password = rpassword.value;


  console.log(email, password);

  auth.createUserWithEmailAndPassword(email, password)
    .then((credential) => {
      uid = credential.user.uid;
      console.log("User created", uid)
    }).catch((error) => {
      console.log("Error is", error)
    })

  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("dob").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
});


const LoginEmail = document.getElementById("loginEmail");
const LoginPassword = document.getElementById("loginPassword");

const btnLogin = document.getElementById("logins");

btnLogin?.addEventListener('click', e => {
  e.preventDefault();

  //read values on button click
  const email = LoginEmail.value;
  const pass = LoginPassword.value;

  console.log(email, pass);

  auth.signInWithEmailAndPassword(email, pass).
    then(cred => {
      console.log("User logged in");

      window.location = 'home.html'; //After successful login, user will be redirected to home.html
      calculateDays();
    }).catch(function(error) {
      console.log("Error", error);
    });

});



//logout

const logout = document.getElementById("logoutbtn");

logout?.addEventListener('click', e => {
  e.preventDefault();
  auth.signOut();
  console.log("User logged out");
  window.location = 'index.html';
});


// birthday
let textquote = document.getElementById("textquote");
let textauthor = document.getElementById("textauthor");

function getUserProfileProvider() {
  
firebase.auth().onAuthStateChanged((user) =>{

  const userId = firebase.auth().currentUser.uid
  const uemail = firebase.auth().currentUser.email
  console.log(uemail)
  if (user) {
    ref.on("value", function(snapshot) {
      let data = snapshot.val().users;
       console.log(data);
     
      Object.values(data).forEach(obj => {

        if (obj.email === uemail) {
          console.log(obj.dob);
          let bname = obj.firstName + " " + obj.lastName;
          let today = new Date();
          let bday = new Date(obj.dob);
          let upcomingBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
          
          if (today > upcomingBday) {
              upcomingBday.setFullYear(today.getFullYear() + 1);
            }

            let one_day = 24 * 60 * 60 * 1000;

            let daysLeft = Math.ceil((upcomingBday.getTime() - today.getTime()) / (one_day));
            
          //quote from type api
          const getNewQuote = async () => {
          
              var url="https://type.fit/api/quotes";    

              // fetch the data from api
              const response=await fetch(url);
              console.log(typeof response);
              //convert response to json and store it in quotes array
              const allQuotes = await response.json();

              // Generates a random number between 0 and the length of the quotes array
              const indx = Math.floor(Math.random()*allQuotes.length);

              //Store the quote present at the randomly generated index
              const quote=allQuotes[indx].text;

              //Store the author of the respective quote
              const auth=allQuotes[indx].author;

              if(auth==null)
              {
                  author = "Anonymous";
              }

              //function to dynamically display the quote and the author
            textquote.textContent = quote;
            textauthor.textContent = auth;
          }
          
          let birthdaytoday = document.getElementById('birthdaytoday'); 
          let birthdaysomeday = document.getElementById('birthdaysomeday');
          if (daysLeft === 365){
            console.log("happy birthday")
            getNewQuote()
            birthdaytoday.style.display = 'block';
            birthdaysomeday.style.display = "none";
             document.getElementById("bname").textContent = bname;
          }else{
            console.log("days left", daysLeft)
             document.getElementById("datedays").textContent = daysLeft;
            birthdaytoday.style.display = 'none';
            birthdaysomeday.style.display = "block";
          }
           
          
        }
          
      });
    }, function (error) {
       console.log("Error: " + error.code);
    });
    
  } else {
    window.location = "login.html"
  }
}); 


}

