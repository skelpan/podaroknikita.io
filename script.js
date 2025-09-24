document.addEventListener('DOMContentLoaded', () => {
    // Инициализация
    const preloader = document.querySelector('.preloader');
    const cardInner = document.querySelector('.card-inner');
    const flipButtons = document.querySelectorAll('.flip-trigger');
    const shareButton = document.getElementById('share-btn');
    const countdownSection = document.getElementById('countdown-section');
    
    // Элементы отсчета времени
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Установка даты рождения (завтра в 00:00)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(0, 0, 0, 0);
    
    // Прелоадер
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }, 2000);
    
    // Функция обновления отсчета времени
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            // День рождения наступил!
            countdownSection.innerHTML = `
                <div class="birthday-message" style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                    <h3 style="color: var(--gold); font-size: 1.8rem; margin-bottom: 1rem;">С Днем Рождения!</h3>
                    <p style="font-size: 1rem; opacity: 0.9;">Пусть этот год будет наполнен счастьем!</p>
                </div>
            `;
            startConfetti();
            clearInterval(countdownInterval);
            return;
        }
        
       // const hours = Math.floor(diff / (1000 * 60 * 60));
      //  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      //  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
       // animateCounter(hoursEl, hours);
      //  animateCounter(minutesEl, minutes);
       // animateCounter(secondsEl, seconds);
    }
    
    // Анимация цифр отсчета
    function animateCounter(element, newValue) {
        const currentValue = parseInt(element.textContent);
        
        if (currentValue !== newValue) {
            element.style.transform = 'scale(1.2)';
            element.style.color = '#ffd700';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '';
                element.textContent = newValue.toString().padStart(2, '0');
            }, 200);
        }
    }
    
    // Запуск отсчета
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Переворот карточки
    flipButtons.forEach(button => {
        button.addEventListener('click', () => {
            cardInner.classList.toggle('flipped');
        });
    });
    
    // Система конфетти
    function startConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        
        // Установка размеров canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Цвета конфетти
        const colors = ['#ff4d6d', '#ffd700', '#00f3ff', '#4ecdc4', '#9d4edd'];
        
        // Класс частицы конфетти
        class ConfettiParticle {
            constructor() {
                this.reset();
                this.y = Math.random() * -100;
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -200;
                this.size = Math.random() * 8 + 3;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speedY = Math.random() * 3 + 2;
                this.speedX = Math.random() * 2 - 1;
                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = Math.random() * 0.1 - 0.05;
            }
            
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.angle += this.rotationSpeed;
                
                if (this.y > canvas.height + this.size) {
                    this.reset();
                    this.y = Math.random() * -100;
                }
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                ctx.restore();
            }
        }
        
        // Создание частиц
        const particles = [];
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new ConfettiParticle());
        }
        
        // Анимация конфетти
        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animateConfetti);
        }
        
        animateConfetti();
        
        // Автоматическое удаление конфетти через 10 секунд
        setTimeout(() => {
            canvas.style.opacity = '0';
            setTimeout(() => {
                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }, 1000);
        }, 10000);
    }
    
    // Функция поделиться
    shareButton.addEventListener('click', async () => {
        const shareData = {
            title: 'С Днем Рождения, Никита! 🎉',
            text: 'Посмотрите эту красивую открытку ко дню рождения!',
            url: window.location.href
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Ссылка скопирована в буфер обмена!');
            }
        } catch (err) {
            await navigator.clipboard.writeText(window.location.href);
            alert('Ссылка скопирована в буфер обмена!');
        }
    });
    
    // Адаптация для мобильных устройств
    function handleMobileResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }
    
    window.addEventListener('resize', handleMobileResize);
    handleMobileResize();
});