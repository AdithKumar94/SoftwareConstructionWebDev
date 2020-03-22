/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 *
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;

    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });

    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));

    section.appendChild(createElement('img', null,
        { src: '/images/'+post.src, alt: post.meta.description_text, class: 'post-image' }));

    return section;
}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;

    // if we get here we have a valid image
    const reader = new FileReader();

    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}

/*
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/

//Declaring the buttons for user access
document.getElementById("Logout").addEventListener("click", logout);
document.getElementById("Login").addEventListener("click", Login);


//Logout mechanism
if (window.localStorage.getItem(0) !== null){
    display(localStorage.getItem(0));
}


//Initalise the webpage as it gets loaded
window.onload = function() {
    document.getElementById("user_login").value = "";
    document.getElementById("pass_login").value = "";
    document.getElementById("user_Register").value = "";
    document.getElementById("name_Register").value = "";
    document.getElementById("password_Register").value = "";
    document.getElementById("email_Register").value = "";
    document.getElementById("Logout").style.display="none";


};


//logout function which logs the user out from the system
function logout(){
    console.log("logged out");
    localStorage.removeItem(0);
    location.reload();
}


//Login to check whether the user enters the correct details or not
function Login() {

    var valid = 0;
    var username1 = document.getElementById("user_login").value;
    var password1 = document.getElementById("pass_login").value;

    const payload = {
        'username': username1,
        'password': password1
    };
    const headers = {
        "Content-Type" : "application/json"
    };

    fetch("http://127.0.0.1:5000/auth/login",{
        headers,
        method: "POST",
        body: JSON.stringify(payload)
    })

        .then(response => response.json())
        .then(function (response) {
            console.log(response);
            if(response.token !== undefined){
                console.log(response);
                document.getElementById("Logout").style.display="block";
                const token = response.token;
                localStorage.setItem(0,token);
                display(token);

            } else {
                alert("Please enter correct username and password");
                document.getElementById('user_login').value = "";
                document.getElementById('pass_login').value = "";
            }

        }).catch(error => console.error('Error:', error));

}



// On successful login the feed for the current user is displayed
function display(data){
    const token = data;
    const parseStrn = "Token " + token;

    var holder = document.getElementById('program start');
    var elem = document.getElementById('base model');
    let h1a = document.createElement('h1');
    let h2a = document.createElement('h2');
    let divA = document.createElement('header');
    elem.parentNode.removeChild(elem);

    divA.class = "banner";
    divA.id = "base model";
    holder.appendChild(divA);

    h1a.innerHTML = "Instacram";
    h1a.style.fontFamily = "Brush Script MT,cursive";
    divA.appendChild(h1a);

    h2a.style.fontFamily = "Lucida Handwriting,sans-serif";
    h2a.innerHTML = "Bringing Social Life Closer to you";
    divA.appendChild(h2a);

    let ula = document.createElement('ul');

    fetch("http://127.0.0.1:5000/user/feed?p=0&n=10",{
        method: 'GET',
        headers: {
            'Authorization': parseStrn,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(async function (responseData) {

            //populate the user feed
            for (let j = 0; j < responseData.posts.length; j++) {

                var div = document.createElement('div');
                let divB = document.createElement('div');

                let ima = document.createElement('img');
                let imb = document.createElement('img');

                let lia = document.createElement('li');
                let lia1 = document.createElement('li');
                let lia2 = document.createElement('li');
                let lia3 = document.createElement('li');
                let lia4 = document.createElement('li');

                let p1 = document.createElement('p');
                let p2 = document.createElement('p');
                let p3 = document.createElement('p');
                let p4 = document.createElement('p');
                let p5 = document.createElement('p');
                let pm = document.createElement('p');

                var sorc = responseData.posts[j].src;
                ima.className = "post-image";
                ima.src = "data:image/png;base64," + sorc;

                p1.innerHTML = responseData.posts[j].meta.author;
                p1.style.fontFamily = "Comic Sans MS, cursive, sans-serif" , p1.className = "post-title";
                p1.style.fontSize = "large";
                p1.style.color = "#ff0066";

                var epoch_time = responseData.posts[j].meta.published;
                var d = new Date(0);
                d.setUTCSeconds(epoch_time);
                p2.className = "post-title";
		console.log(d.getHours());
                console.log(d.getMinutes());
                p2.innerHTML = d.getDate() + "/" + (d.getMonth() + 1) + "/" + (d.getFullYear()) + " at " + (((d.getHours()) < 10 ? '0':'') + d.getHours()) + ":" + (((d.getMinutes()) < 10? '0':'') + d.getMinutes());
                p2.style.fontSize = "xx-small";

                lia4.innerHTML = responseData.posts[j].meta.description_text;
                lia4.style.fontFamily = "Lucida Calligraphy,Comic Sans MS,Lucida Console";
                lia4.style.fontSize = "medium";

                lia1.appendChild(p1);
                ula.appendChild(lia1);

                lia1.appendChild(p2);
                ula.appendChild(lia1);

                lia.appendChild(ima);
                ula.appendChild(lia);

                ula.appendChild(lia4);


                imb.src = "images/like.png";
                imb.id = "pageLike";
                var liked1 = "liked by: ";
                var liked = liked1.bold();
		liked.fontcolor("#0000FF");
//		var liked = liked1.fontcolor = "#0000ff";
                var dataTook = responseData.posts[j].meta.likes.length;

                p3.innerHTML = responseData.posts[j].meta.likes.length;
                for (let g = 0; g < dataTook; g++) {
                    console.log(responseData.posts[j].meta.likes[g]);
                    console.log(parseStrn);

                    const request = async () => {
                        var response = await fetch("http://127.0.0.1:5000/user/?id=" + responseData.posts[j].meta.likes[g], {
                            method: 'GET',
                            headers: {
                                'Authorization': parseStrn,
                                'Content-Type': 'application/json',
                            }
                        });
                        var like = await response.json();
                        liked = liked + await like.name+ ", ";
                    }
                    await request();
                }


                pm.appendChild(imb);
                pm.appendChild(p3);

                if (dataTook > 0){
                    console.log(liked);
                    liked = liked.substring(0, liked.length - 2);
                    p5.innerHTML = liked;
                }

                pm.appendChild(p5);
                lia2.appendChild(pm);
                ula.appendChild(lia2);

                let ulc = document.createElement("ul");
                ula.appendChild(ulc);

                div.className = "post";
                ula.appendChild(div);

                //Finding the length for comments
                for (let l = 0; l < responseData.posts[j].comments.length; l++) {
                    let lic1 = document.createElement("li");
                    let lic2 = document.createElement("li");

                    ulc.className = "comments_post";

                    let pc1 = document.createElement('p');
                    let pc2 = document.createElement('p');
                    let pc3 = document.createElement('p');
                    pc1.id = "comments-field1" , pc1.class = "comments_post_li";
                    pc2.id = "comments-field2" , pc2.class = "comments_post_li_time";
                    pc3.id = "comments-field3" , pc3.class = "comments_post_li";
                    pc3.innerHTML = responseData.posts[j].comments[l].comment;
		    var username_t = responseData.posts[j].comments[l].author;
                    var username = username_t.bold();
                    pc1.innerHTML = username + " : " + pc3.innerHTML;

                    //pc1.innerHTML = responseData.posts[j].comments[l].author + " : " + pc3.innerHTML;
                    var commenttime = responseData.posts[j].comments[l].published;
                    var dcom = new Date(0); // The 0 there is the key, which sets the date to the epoch
                    dcom.setUTCSeconds(commenttime);
                    pc2.innerHTML = d.getDate() + "/" + (dcom.getMonth() + 1) + "/" + (dcom.getFullYear()) + " at " + ((dcom.getHours() < 10 ? '0' : '') + dcom.getHours()) + ":" + ((dcom.getMinutes() < 10 ? '0' : '') + dcom.getMinutes());
                    pc2.style.fontSize = "xx-small";

                    lic1.appendChild(pc1);
                    lic2.appendChild(pc2);

                    ulc.appendChild(lic1);
                    ulc.appendChild(lic2);

                }


                div.appendChild(ulc);
                divB.appendChild(ula);
                //var parent = document.getElementById("base model");
                holder.appendChild(divB);


            }

            if (responseData.posts.length == 0){
                holder.append("Follow people to get feeds");
            }



        }).catch(error => console.error('Error:', error));

}


//Registering a new user
document.getElementById("Register").addEventListener("click", Register);
function Register() {
    var username = document.getElementById("user_Register").value;
    var name = document.getElementById("name_Register").value;
    var password = document.getElementById("password_Register").value;
    var emailID = document.getElementById("email_Register").value;
    const payload = {
        'username': username,
        'password': password,
        'email': emailID,
        'name': name
    };

    const headers = {
        "Content-Type" : "application/json"
    };

    fetch("http://127.0.0.1:5000/auth/signup",{
        headers,
        method: "POST",
        body: JSON.stringify(payload)
    })

        .then(response => response.json())
        .then(function (response) {
            if(response.token !== undefined){
                alert("User Registered!!!!!Please login to continue");

            } else {
                alert("Please enter correct details and try again!!!");
            }

            document.getElementById('name_Register').value = "";
            document.getElementById('password_Register').value = "";
            document.getElementById('user_Register').value = "";
            document.getElementById('email_Register').value = "";


        }).catch(error => console.error('Error:', error));

}



