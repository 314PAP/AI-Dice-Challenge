/**
 * Final Integration Test
 * Comprehensive test of all critical game functionality
 */

console.log('🔥 Final Integration Test Starting...');

class IntegrationTest {
    constructor() {
        this.results = [];
        this.errors = [];
    }

    async runAllTests() {
        console.log('🚀 Running comprehensive integration test...');
        
        try {
            await this.testModuleStructure();
            await this.testGameInitialization();
            await this.testUIComponents();
            await this.testChatSystem();
            await this.testAISystem();
            
            this.reportResults();
        } catch (error) {
            console.error('💥 Critical integration test error:', error);
            this.errors.push(`Critical error: ${error.message}`);
            this.reportResults();
        }
    }

    async testModuleStructure() {
        console.log('📦 Testing module structure...');
        
        const criticalModules = [
            { path: './src/main.js', name: 'Main Entry Point' },
            { path: './src/ui/gameUIController.js', name: 'UI Controller' },
            { path: './src/js/game/gameState.js', name: 'Game State' },
            { path: './src/js/game/gameController.js', name: 'Game Controller' },
            { path: './src/ai/controllers/enhancedAIController.js', name: 'AI Controller' }
        ];

        for (const module of criticalModules) {
            try {
                await import(module.path);
                this.results.push(`✅ ${module.name} - Module loads correctly`);
            } catch (error) {
                this.errors.push(`❌ ${module.name} - Module failed: ${error.message}`);
            }
        }
    }

    async testGameInitialization() {
        console.log('🎮 Testing game initialization...');
        
        try {
            // Test Game State
            const { gameState } = await import('./src/js/game/gameState.js');
            if (gameState) {
                this.results.push('✅ Game State - Object accessible');
                
                if (Array.isArray(gameState.players)) {
                    this.results.push(`✅ Game State - Players array exists (${gameState.players.length} players)`);
                } else {
                    this.errors.push('❌ Game State - Players array missing or invalid');
                }
            } else {
                this.errors.push('❌ Game State - Object not accessible');
            }

            // Test Game Controller
            const gameController = await import('./src/js/game/gameController.js');
            if (gameController.initializeGame) {
                this.results.push('✅ Game Controller - Initialize function available');
            } else {
                this.errors.push('❌ Game Controller - Initialize function missing');
            }

        } catch (error) {
            this.errors.push(`❌ Game Initialization - Error: ${error.message}`);
        }
    }

    async testUIComponents() {
        console.log('🖼️ Testing UI components...');
        
        try {
            const { GameUIController } = await import('./src/ui/gameUIController.js');
            
            if (GameUIController) {
                this.results.push('✅ UI Controller - Class available');
                
                // Test instantiation
                const uiController = new GameUIController();
                this.results.push('✅ UI Controller - Instance created');
                
                // Test initialization (this might fail but we'll catch it)
                try {
                    await uiController.initialize();
                    this.results.push('✅ UI Controller - Initialization successful');
                } catch (initError) {
                    this.errors.push(`⚠️ UI Controller - Initialization failed: ${initError.message}`);
                }
                
            } else {
                this.errors.push('❌ UI Controller - Class not available');
            }

        } catch (error) {
            this.errors.push(`❌ UI Components - Error: ${error.message}`);
        }
    }

    async testChatSystem() {
        console.log('💬 Testing chat system...');
        
        try {
            // Check if global chat function exists
            if (typeof window.addChatMessage === 'function') {
                this.results.push('✅ Chat System - Global addChatMessage function available');
                
                // Test the function
                window.addChatMessage('Test', 'Integration test message');
                this.results.push('✅ Chat System - Message function works');
                
            } else {
                this.errors.push('❌ Chat System - Global addChatMessage function missing');
            }

        } catch (error) {
            this.errors.push(`❌ Chat System - Error: ${error.message}`);
        }
    }

    async testAISystem() {
        console.log('🤖 Testing AI system...');
        
        try {
            const aiController = await import('./src/ai/controllers/enhancedAIController.js');
            
            if (aiController.enhancedAI) {
                this.results.push('✅ AI System - Enhanced AI object available');
            } else {
                this.errors.push('❌ AI System - Enhanced AI object missing');
            }

            if (aiController.generateAIGameReaction) {
                this.results.push('✅ AI System - Generate reaction function available');
                
                // Test the function
                const reaction = aiController.generateAIGameReaction('ChatGPT', 'roll');
                if (reaction) {
                    this.results.push(`✅ AI System - Reaction generated: "${reaction}"`);
                } else {
                    this.errors.push('❌ AI System - Reaction generation returned empty');
                }
            } else {
                this.errors.push('❌ AI System - Generate reaction function missing');
            }

        } catch (error) {
            this.errors.push(`❌ AI System - Error: ${error.message}`);
        }
    }

    reportResults() {
        console.log('\n🏁 INTEGRATION TEST RESULTS');
        console.log('================================');
        
        if (this.results.length > 0) {
            console.log('\n✅ SUCCESSFUL TESTS:');
            this.results.forEach(result => console.log(result));
        }
        
        if (this.errors.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.errors.forEach(error => console.log(error));
        }
        
        const totalTests = this.results.length + this.errors.length;
        const successRate = Math.round((this.results.length / totalTests) * 100);
        
        console.log('\n📊 SUMMARY:');
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Successful: ${this.results.length}`);
        console.log(`Failed: ${this.errors.length}`);
        console.log(`Success Rate: ${successRate}%`);
        
        if (this.errors.length === 0) {
            console.log('\n🎉 ALL TESTS PASSED! The refactored game should be fully functional.');
        } else if (successRate >= 80) {
            console.log('\n⚠️ MOSTLY WORKING - Some issues detected but core functionality should work.');
        } else {
            console.log('\n🚨 SIGNIFICANT ISSUES - Major problems detected that need fixing.');
        }
        
        // Make results available globally
        window.integrationTestResults = {
            successful: this.results,
            failed: this.errors,
            successRate,
            summary: `${this.results.length}/${totalTests} tests passed (${successRate}%)`
        };
    }
}

// Auto-run test when loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🏃 Starting integration test...');
    const test = new IntegrationTest();
    await test.runAllTests();
});

// Also make available globally for manual execution
window.IntegrationTest = IntegrationTest;
