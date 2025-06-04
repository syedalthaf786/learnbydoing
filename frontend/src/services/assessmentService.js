const roleAssessments = {
    "Frontend Developer": {
      questions: [
        {
          id: 1,
          question: "Given a performance issue where a React component re-renders frequently with large datasets, explain which optimization technique would be most appropriate in this scenario:\n\nComponent code:\n```\nconst DataGrid = ({ items, onSort }) => {\n  const [sortedItems, setSortedItems] = useState(items);\n  // ... rendering logic\n};\n```",
          options: [
            "Use React.memo() since the component receives props",
            "Implement useMemo() for sortedItems calculation",
            "Apply useCallback() on the onSort function",
            "Use PureComponent instead of a functional component"
          ],
          correctAnswer: 1,
          explanation: "The scenario involves state computation with large datasets, making useMemo most appropriate for performance optimization."
        },
        {
          id: 2,
          question: "Debug this code and identify the cause of memory leak:\n```\nfunction UserProfile() {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    const subscription = api.subscribe(user => {\n      setData(user);\n    });\n  }, []);\n  return <div>{data?.name}</div>;\n}\n```",
          options: [
            "The useState hook is not properly initialized",
            "Missing dependency array in useEffect",
            "No cleanup function for subscription",
            "Incorrect API usage"
          ],
          correctAnswer: 2,
          explanation: "The subscription needs to be cleaned up to prevent memory leaks."
        },
        {
          id: 3,
          question: "Identify the potential security vulnerability in this code:\n```\nfunction CommentSection({ userInput }) {\n  return <div dangerouslySetInnerHTML={{ __html: userInput }} />;\n}\n```",
          options: [
            "Performance issue with rendering",
            "XSS vulnerability with unvalidated input",
            "Memory leak in component",
            "Incorrect prop type usage"
          ],
          correctAnswer: 1
        }
      ],
      passingScore: 70
    },
    "Backend Developer": {
      questions: [
        {
          id: 1,
          question: "Analyze this code for potential race conditions:\n```\nasync function updateUserPoints(userId, points) {\n  const user = await User.findById(userId);\n  user.points += points;\n  await user.save();\n}\n```",
          options: [
            "No issues, the code is asynchronous",
            "Race condition when multiple updates occur simultaneously",
            "Invalid MongoDB query syntax",
            "Incorrect use of async/await"
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Given this Node.js server code, identify the security vulnerability:\n```\napp.get('/api/file', (req, res) => {\n  const fileName = req.query.name;\n  const file = fs.readFileSync(fileName);\n  res.send(file);\n});\n```",
          options: [
            "Missing error handling",
            "Synchronous file reading",
            "Path traversal vulnerability",
            "Incorrect response format"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "Debug this MongoDB aggregation pipeline issue:\n```\ndb.orders.aggregate([\n  { $match: { status: 'completed' } },\n  { $group: {\n      _id: '$userId',\n      total: { $sum: '$amount' }\n    }},\n  { $sort: { total: -1 } },\n  { $limit: 5 },\n  { $lookup: {\n      from: 'users',\n      localField: '_id',\n      foreignField: '_id',\n      as: 'user'\n    }}\n]);\n```\nThe pipeline is slow with large datasets. What's the most effective optimization?",
          options: [
            "Add index on status field",
            "Move $limit before $lookup",
            "Remove $sort operation",
            "Change $group structure"
          ],
          correctAnswer: 1
        }
      ],
      passingScore: 70
    },
    "UI/UX Designer": {
      questions: [
        {
          id: 1,
          question: "In a mobile app design, you notice that users are having trouble with a multi-step form. The current implementation shows all steps on separate screens. Which solution would best improve the user experience?",
          options: [
            "Add a progress indicator and allow users to navigate between steps",
            "Combine all steps into a single scrollable form",
            "Add a 'Save Draft' feature for each step",
            "Implement form validation only at the final step"
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: "Analyze this design pattern issue:\nA dashboard displays real-time data updates every 5 seconds, causing users to lose track of what they were viewing. How would you solve this?",
          options: [
            "Remove auto-updates completely",
            "Add visual indicators for changed values and allow user control over updates",
            "Increase the update interval to 30 seconds",
            "Show updates in a separate notification area"
          ],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "You're designing a color scheme for a financial app. Which approach ensures both aesthetic appeal and accessibility?",
          options: [
            "Use trendy colors that match current design trends",
            "Implement a high contrast ratio and include colorblind-friendly patterns",
            "Let users customize all colors",
            "Use standard banking colors like blue and grey"
          ],
          correctAnswer: 1
        }
      ],
      passingScore: 70
    },
    "ML Engineer": {
      questions: [
        {
          id: 1,
          question: "Given this model training code, identify the potential issue:\n```python\ndef train_model(X_train, y_train):\n    model = RandomForestClassifier(n_estimators=100)\n    model.fit(X_train, y_train)\n    predictions = model.predict(X_train)\n    accuracy = accuracy_score(y_train, predictions)\n    return model, accuracy\n```",
          options: [
            "Incorrect model initialization",
            "Missing cross-validation",
            "Wrong accuracy calculation",
            "Insufficient n_estimators"
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "In a computer vision project, your CNN model shows high training accuracy but poor real-world performance. Given this architecture:\n```python\nmodel = Sequential([\n    Conv2D(32, (3, 3), activation='relu'),\n    MaxPooling2D(),\n    Conv2D(64, (3, 3), activation='relu'),\n    MaxPooling2D(),\n    Dense(128, activation='relu'),\n    Dense(num_classes, activation='softmax')\n])\n```\nWhat's the most likely issue?",
          options: [
            "Need more convolutional layers",
            "Missing dropout layers and data augmentation",
            "Wrong activation functions",
            "Insufficient dense layers"
          ],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "Your NLP model shows bias in sentiment analysis. Given this preprocessing code:\n```python\ndef preprocess_text(text):\n    text = text.lower()\n    text = remove_punctuation(text)\n    text = remove_stopwords(text)\n    return text\n```\nWhat's the most effective way to address bias?",
          options: [
            "Add more preprocessing steps",
            "Use a larger training dataset",
            "Implement balanced dataset sampling and bias testing",
            "Change the text normalization method"
          ],
          correctAnswer: 2
        }
      ],
      passingScore: 70
    }
  };
  
  export const getAssessment = (roleTitle) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(roleAssessments[roleTitle] || null);
      }, 500);
    });
  };
  
  export const evaluateAssessment = (roleTitle, answers) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const assessment = roleAssessments[roleTitle];
        if (!assessment) {
          resolve({ score: 0, passed: false });
          return;
        }
  
        const totalQuestions = assessment.questions.length;
        const correctAnswers = assessment.questions.reduce((count, question) => {
          return count + (answers[question.id] === question.correctAnswer ? 1 : 0);
        }, 0);
  
        const score = (correctAnswers / totalQuestions) * 100;
        const passed = score >= assessment.passingScore;
  
        resolve({
          score,
          passed,
          feedback: passed 
            ? "Congratulations! You've passed the assessment."
            : "Unfortunately, you didn't meet the required score. Feel free to try again after reviewing the requirements."
        });
      }, 1000);
    });
  };