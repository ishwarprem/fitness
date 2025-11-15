 // --- Original Website Script ---
        function showDetail(muscle) {
            document.getElementById('mainPage').classList.add('hidden');
            document.getElementById(muscle + 'Detail').classList.add('active');
            window.scrollTo(0, 0);
        }

        function showMain() {
            const detailPages = document.querySelectorAll('.detail-page');
            detailPages.forEach(page => page.classList.remove('active'));
            document.getElementById('mainPage').classList.remove('hidden');

            // Reset all video buttons and hide all videos
            const allVideos = document.querySelectorAll('.exercise-video');
            const allButtons = document.querySelectorAll('.video-btn');

            allVideos.forEach(video => {
                video.style.display = 'none';
                if (video.tagName === 'VIDEO') {
                    video.pause();
                    video.currentTime = 0;
                }
            });

            allButtons.forEach(button => {
                button.textContent = 'WATCH FORM';
                button.classList.remove('active');
            });

            window.scrollTo(0, 0);
        }

        function toggleVideo(button) {
            const video = button.nextElementSibling;

            if (video.style.display === 'none') {
                video.style.display = 'block';
                button.textContent = 'HIDE FORM';
                button.classList.add('active');

                // Play video if it's a video element
                if (video.tagName === 'VIDEO') {
                    video.play();
                }
            } else {
                video.style.display = 'none';
                button.textContent = 'WATCH FORM';
                button.classList.remove('active');

                // Pause video if it's a video element
                if (video.tagName === 'VIDEO') {
                    video.pause();
                }
            }
        }
  
    
    