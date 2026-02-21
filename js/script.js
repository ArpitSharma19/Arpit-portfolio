//toggle icon navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

//Scroll section
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            //Active link
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
            //active animation
            sec.classList.add('show-animate');
        }
        else{
            sec.classList.remove('show-animate');
        }
    });

    //Sticky header
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    //Remove toggle
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');

    //Animation footer
    let footer = document.querySelector('footer');
    footer.classList.toggle('show-animate', this.innerHeight + this.scrollY >= document.scrollingElement.scrollHeight);
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
        const contactSection = document.querySelector('.contact form');
        if (contactSection) {
            const notice = document.createElement('div');
            notice.className = 'alert success';
            notice.textContent = 'Thanks! Your message has been sent.';
            contactSection.prepend(notice);
            setTimeout(() => {
                notice.remove();
            }, 6000);
        }
        if (history.replaceState) {
            const url = new URL(window.location.href);
            url.searchParams.delete('success');
            history.replaceState(null, '', url.pathname + url.hash);
        }
    }

    const form = document.getElementById('contact-form');
    if (!form) return;

    const serviceId = form.dataset.emailjsService || '';
    const templateId = form.dataset.emailjsTemplate || '';
    const publicKey = form.dataset.emailjsPublicKey || '';

    const showAlert = (msg, type = 'success') => {
        const notice = document.createElement('div');
        notice.className = `alert ${type}`;
        notice.textContent = msg;
        form.prepend(notice);
        setTimeout(() => notice.remove(), 6000);
    };

    if (window.emailjs && publicKey && !publicKey.includes('REPLACE')) {
        emailjs.init({ publicKey });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!window.emailjs) {
            showAlert('Email service unavailable. Please try again later.', 'error');
            return;
        }
        if (
            !publicKey || publicKey.includes('REPLACE') ||
            !serviceId || serviceId.includes('REPLACE') ||
            !templateId || templateId.includes('REPLACE')
        ) {
            showAlert('Email configuration missing. Set EmailJS keys in the form.', 'error');
            return;
        }

        const name = form.querySelector('input[name="name"]')?.value?.trim() || '';
        const email = form.querySelector('input[name="email"]')?.value?.trim() || '';
        const subject = form.querySelector('input[name="subject"]')?.value?.trim() || '';
        const phone = form.querySelector('input[name="phone"]')?.value?.trim() || '';
        const message = form.querySelector('textarea[name="message"]')?.value?.trim() || '';

        try {
            await emailjs.send(serviceId, templateId, {
                from_name: name,
                reply_to: email,
                subject,
                phone,
                message
            });
            showAlert('Thanks! Your message has been sent.', 'success');
            form.reset();
        } catch (err) {
            showAlert('Failed to send message. Please try again.', 'error');
        }
    });
});
