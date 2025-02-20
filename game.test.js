// Game Test Suite
const gameTests = {
    testFoodSpawning() {
        // Mock canvas and context
        const mockCanvas = {
            width: 800,
            height: 600,
            getContext: () => ({
                clearRect: () => {},
                fillRect: () => {},
                fillStyle: '',
                shadowBlur: 0,
                shadowColor: ''
            })
        };
        
        // Mock DOM elements
        document.getElementById = (id) => {
            return {
                clientWidth: 830,
                clientHeight: 630,
                style: {},
                classList: { remove: () => {} },
                textContent: ''
            };
        };

        // Initialize game variables
        const gridSize = 20;
        const maxX = Math.floor(mockCanvas.width / gridSize);
        const maxY = Math.floor(mockCanvas.height / gridSize);

        // Test food spawning boundaries
        function testFoodBoundaries() {
            let isValid = true;
            for(let i = 0; i < 100; i++) {
                const newFood = {
                    x: Math.floor(Math.random() * maxX),
                    y: Math.floor(Math.random() * maxY)
                };
                if (newFood.x >= maxX || newFood.y >= maxY) {
                    isValid = false;
                    console.error(`Invalid food position: {x: ${newFood.x}, y: ${newFood.y}}`)
                    break;
                }
            }
            return isValid;
        }

        // Test snake movement and collision
        function testSnakeMovement() {
            const snake = [{ x: 10, y: 10 }];
            const head = { x: snake[0].x + 1, y: snake[0].y };
            
            // Test wall collision
            const isWallCollision = head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY;
            if (!isWallCollision) {
                console.error('Wall collision not detected properly');
                return false;
            }
            return true;
        }

        // Test score calculation
        function testScoreCalculation() {
            let score = 0;
            const initialSpeed = 200;
            
            // Simulate eating 10 food items
            for(let i = 0; i < 10; i++) {
                score += 10;
                const newSpeed = Math.max(50, initialSpeed - Math.floor(score / 20) * 10);
                if (newSpeed > initialSpeed || newSpeed < 50) {
                    console.error('Invalid speed calculation');
                    return false;
                }
            }
            return true;
        }

        // Run all tests
        const results = {
            foodBoundaries: testFoodBoundaries(),
            snakeMovement: testSnakeMovement(),
            scoreCalculation: testScoreCalculation()
        };

        // Log results
        console.log('Test Results:', results);
        return Object.values(results).every(result => result);
    }
};

// Run tests
gameTests.testFoodSpawning();