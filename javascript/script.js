//page sections - general
let container = document.getElementsByClassName('container');

//page sections
let about = document.getElementById('about');
let projects = document.getElementById('projects');
let work = document.getElementById('work');
let education = document.getElementById('education');
let contact = document.getElementById('contact');

//popup windows
let popup = document.getElementById('popup');

//popup exit button
let exit = document.getElementById('exit');

//popitems - general
let popItem = document.getElementsByClassName('popItem');

//popup items
let aboutPage = document.getElementById('aboutPage');
let projectsPage = document.getElementById('projectsPage');
let workPage = document.getElementById('workPage');
let educationPage = document.getElementById('educationPage');
let contactPage = document.getElementById('contactPage');


//event handlers for popItems
about.onclick = function () {
    popup.style.display = 'block';
    exit.style.display = 'block';

    if (projectsPage.style.display == 'block') {
      projectsPage.style.display = 'none';
    } else if (workPage.style.display == 'block') {
      workPage.style.display = 'none';
    } else if (educationPage.style.display == 'block') {
      educationPage.style.display = 'none';
    } else if (contactPage.style.display == 'block') {
      contactPage.style.display = 'none';
    }
    aboutPage.style.display = 'block';
};

projects.onclick = function () {
  popup.style.display = 'block';
  exit.style.display = 'block';

  if (aboutPage.style.display == 'block') {
    aboutPage.style.display = 'none';
  } else if (workPage.style.display == 'block') {
    workPage.style.display = 'none';
  } else if (educationPage.style.display == 'block') {
    educationPage.style.display = 'none';
  } else if (contactPage.style.display == 'block') {
    contactPage.style.display = 'none';
  }
  projectsPage.style.display = 'block';
};

work.onclick = function () {
  popup.style.display = 'block';
  exit.style.display = 'block';

  if (aboutPage.style.display == 'block') {
    aboutPage.style.display = 'none';
  } else if (projectsPage.style.display == 'block') {
    projectsPage.style.display = 'none';
  } else if (educationPage.style.display == 'block') {
    educationPage.style.display = 'none';
  } else if (contactPage.style.display == 'block') {
    contactPage.style.display = 'none';
  }
  workPage.style.display = 'block';
};

education.onclick = function () {
  popup.style.display = 'block';
  exit.style.display = 'block';

  if (aboutPage.style.display == 'block') {
    aboutPage.style.display = 'none';
  } else if (projectsPage.style.display == 'block') {
    projectsPage.style.display = 'none';
  } else if (workPage.style.display == 'block') {
    workPage.style.display = 'none';
  } else if (contactPage.style.display == 'block') {
    contactPage.style.display = 'none';
  }
  educationPage.style.display = 'block';
};

contact.onclick = function () {
  popup.style.display = 'block';
  exit.style.display = 'block';

  if (aboutPage.style.display == 'block') {
    aboutPage.style.display = 'none';
  } else if (projectsPage.style.display == 'block') {
    projectsPage.style.display = 'none';
  } else if (workPage.style.display == 'block') {
    workPage.style.display = 'none';
  } else if (educationPage.style.display == 'block') {
    educationPage.style.display = 'none';
  }
  contactPage.style.display = 'block';
};


//exit button event handler
function exitMouseDown() {
  exit.innerHTML = '<i class="fa-solid fa-xmark fa-3x"></i>';
}

function exitMouseUp() {
  exit.innerHTML = '<i class="fa-solid fa-xmark fa-4x"></i>';
  popup.style.display = 'none';
}

exit.addEventListener ('mousedown', exitMouseDown);
exit.addEventListener ('mouseup', exitMouseUp);