<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wellness Lessons</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            background-color: #f0f8ff;
            color: #333;
        }
        h1, h2, h3 {
            color: #0056b3;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            background-color: #ffffff;
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 8px;
            border-left: 5px solid #007BFF;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        li:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        #lesson-details {
            margin-top: 30px;
            padding: 20px;
            background-color: #e6f2ff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .question {
            background-color: #f9f9f9;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 6px;
        }
        .question ul {
            list-style-type: circle;
            margin-top: 10px;
            padding-left: 20px;
        }
        .question li {
            background-color: transparent;
            border-left: none;
            box-shadow: none;
            padding: 5px 0;
            margin-bottom: 0;
        }
        #go-back {
            background-color: #007BFF;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        }
        #go-back:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>

    <h1>Our Wellness Lessons</h1>
    <ul id="lessons-list">
        </ul>

    <section id="lesson-details" style="display:none;">
        <h2 id="lesson-title"></h2>
        <p id="lesson-description"></p>
        <p id="lesson-text"></p>
        
        <h3>Questions</h3>
        <div id="questions-container"></div>
        <button id="go-back">Go Back</button>
    </section>

    <script>
        const lessonsList = document.getElementById('lessons-list');
        const lessonDetailsSection = document.getElementById('lesson-details');
        const lessonTitle = document.getElementById('lesson-title');
        const lessonDescription = document.getElementById('lesson-description');
        const lessonText = document.getElementById('lesson-text');
        const questionsContainer = document.getElementById('questions-container');
        const goBackButton = document.getElementById('go-back');
        
        const jsonFile = 'all_lessons.json';

        function displayLessonDetails(lesson) {
            lessonTitle.textContent = `Lesson ${lesson.number}: ${lesson.name}`;
            lessonDescription.textContent = lesson.description;
            lessonText.textContent = lesson.lessonText;

            questionsContainer.innerHTML = '';
            lesson.questions.forEach(question => {
                const questionElement = document.createElement('div');
                questionElement.className = 'question';
                
                let optionsList = question.options.map((option, index) => {
                    return `<li>${option}</li>`;
                }).join('');

                questionElement.innerHTML = `
                    <p><strong>Q:</strong> ${question.question}</p>
                    <ul>${optionsList}</ul>
                `;
                questionsContainer.appendChild(questionElement);
            });
            
            lessonDetailsSection.style.display = 'block';
            lessonsList.style.display = 'none';
        }

        goBackButton.addEventListener('click', () => {
            lessonsList.style.display = 'block';
            lessonDetailsSection.style.display = 'none';
        });

        fetch(jsonFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Successfully loaded lesson data:", data);

                data.forEach(lesson => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Lesson ${lesson.number}: ${lesson.name}`;
                    
                    listItem.addEventListener('click', () => {
                        displayLessonDetails(lesson);
                    });
                    
                    lessonsList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error("Error fetching lesson data:", error);
                lessonsList.innerHTML = '<li>Failed to load lessons. Please check the console for details.</li>';
            });
    </script>

</body>
</html>