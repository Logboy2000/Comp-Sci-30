class Notification {
    constructor(title, description, timeout = 2000) {
        this.element = document.createElement('div')
        this.element.onclick = () => {
            this.slideOut()
        }

        this.title = document.createElement('label')
        this.title.innerText = title
        this.element.appendChild(this.title)

        this.description = document.createElement('p')
        this.description.innerText = description
        this.element.appendChild(this.description)

        this.element.className = 'notification'
        this.element.style.opacity = 1
        this.element.style.transform = 'translateY(-150%)'
        document.getElementById('notificationContainer').insertBefore(this.element, document.getElementById('notificationContainer').firstChild)

        // Slide in animation
        setTimeout(() => {
            this.element.style.transition = 'transform 0.5s ease-out'
            this.element.style.transform = 'translateY(0)'
        }, 50)

        setTimeout(() => {
            this.slideOut()
        }, timeout)
    }
    slideOut() {
        this.element.style.transition = 'transform 0.5s ease-in'
        this.element.style.transform = 'translateY(-150%)'
        setTimeout(() => {
            this.element.remove()
        }, 500)
    }
}