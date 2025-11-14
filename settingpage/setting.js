document.addEventListener('DOMContentLoaded', function() {
    const cancelBtn = document.getElementById('cancel-btn');
    const saveBtn = document.getElementById('save-btn');
    const defaultsBtn = document.getElementById('defaults-btn');
    const textSpeed = localStorage.getItem('textSpeed') || 2;
    const textSize = localStorage.getItem('textSize') || 'medium';
    const musicVolume = localStorage.getItem('musicVolume') || 50;
    const sfxVolume = localStorage.getItem('sfxVolume') || 60;
    const alertBackgound = this.getElementById('alert-background');
    const restoreAlert = this.getElementById('restore-alert');
    const saveAlert = this.getElementById('save-alert');

    document.getElementById('text-speed').value = textSpeed;
    document.getElementById('text-speed-value').textContent = textSpeed;
    document.getElementById('text-size').value = textSize;
    document.getElementById('music-volume').value = musicVolume;
    document.getElementById('music-volume-value').textContent = musicVolume + '%';
    document.getElementById('sfx-volume').value = sfxVolume;
    document.getElementById('sfx-volume-value').textContent = sfxVolume + '%';

    function closeSettings() { 
        window.location.href = "../index.html";
    }
    cancelBtn.addEventListener('click', closeSettings);

    function updateTextPreview() {
        const size = document.getElementById('text-size').value;
        const preview = document.getElementById('text-preview');
        preview.style.fontSize = size === 'small' ? '16px' : size === 'medium' ? '18px' : '22px';
    }

    function updateTextDemo() {
        const speed = parseInt(document.getElementById('text-speed').value);
        let speedLabel;

        switch(speed){
            case 1: speedLabel = "Slow"; break;
            case 2: speedLabel = "Medium"; break;
            case 3: speedLabel = "Fast"; break;
            default: speedLabel = "Medium";
    }

        document.getElementById('text-speed-value').textContent = speedLabel;
    }

    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        const valueDisplay = document.getElementById(slider.id + '-value');
        if (valueDisplay) {
            valueDisplay.textContent = slider.id.includes('volume') ? slider.value + '%' : slider.value;
            slider.addEventListener('input', function() {
                valueDisplay.textContent = slider.id.includes('volume') ? this.value + '%' : this.value;
                if (slider.id === 'text-speed') updateTextDemo();
            });
        }
    });
    document.getElementById('text-size').addEventListener('change', updateTextPreview);

    saveBtn.addEventListener('click', function() {
        localStorage.setItem('textSpeed', document.getElementById('text-speed').value);
        localStorage.setItem('textSize', document.getElementById('text-size').value);
        localStorage.setItem('musicVolume', document.getElementById('music-volume').value);
        localStorage.setItem('sfxVolume', document.getElementById('sfx-volume').value);
        alertBackgound.style.display = "flex";
        restoreAlert.style.display = "none";
        saveAlert.style.display = "flex";
        setTimeout(() => {
            closeSettings();
        }, 1500);
    });

    defaultsBtn.addEventListener('click', function() {
        document.getElementById('text-speed').value = 5;
        document.getElementById('text-speed-value').textContent = '5';
        document.getElementById('text-size').value = 'medium';
        document.getElementById('music-volume').value = 50;
        document.getElementById('music-volume-value').textContent = '50%';
        document.getElementById('sfx-volume').value = 60;
        document.getElementById('sfx-volume-value').textContent = '60%';
        updateTextPreview();
        updateTextDemo();
        alertBackgound.style.display = "flex";
        restoreAlert.style.display = "flex";
        saveAlert.style.display = "none";

        setTimeout(() => {
            alertBackgound.style.display = "none";
            restoreAlert.style.display = "none";
        }, 1500);
    });

    document.getElementById('text-speed').addEventListener('input', updateTextDemo);
    updateTextPreview();
    updateTextDemo();
});
