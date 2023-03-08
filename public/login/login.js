const loginbtn = document.getElementById('login-btn');
loginbtn.addEventListener('click',userLogin);
function userLogin(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    ValidateEmail(email);
    console.log(email);
    const token=localStorage.getItem('token');
    axios.post(`http://localhost:3000/login`,{email:email,password:password},{headers:{'authorization':token}})
    .then(result=>{
        localStorage.setItem('id',result.data.id);
        alert(result.data.message);
        if(result){
            if(result.data.message === 'Login successfully'){
                window.location.replace('../../uploadimage/imageupload.html');
            }  
        }
        else {
            throw new Error('Failed to login')
        }
    })  
    .catch(err => {
        console.log(err)
    })
}

function ValidateEmail(inputText)
{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.match(mailformat))
    {
    return true;
    }
    else
    {
    alert("You have entered an invalid email address!");
    inputText.focus();
    return false;
    }
}


