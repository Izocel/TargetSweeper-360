import { Target } from './models/Target';
import { SweepConfiguration } from './models/SweepConfiguration';
import { SweepPatternGenerator } from './services/SweepPatternGenerator';
import { KMZGenerator } from './services/KMZGenerator';
import { ProjectManager } from './services/ProjectManager';
import { LabelFormat } from './constants/enums/LabelFormats';

/**
 * Main application entry point
 */
async function main() {
    try {
        // Use ProjectManager to generate from projects.json
        const projectManager = new ProjectManager();

        console.log('🎯 TargetSweeper-360 - Generating Projects');
        console.log('==========================================');

        // Generate all projects from configuration
        const results = await projectManager.generateAllProjects();

        if (results.failed > 0) {
            console.log('\n❌ Some projects failed to generate. Check the error messages above.');
            process.exit(1);
        } else {
            console.log('\n🎉 All projects generated successfully!');
        }

    } catch (error) {
        console.error('❌ Error generating projects:', error);
        process.exit(1);
    }
}


main();

// Export for use as a module
export {
    Target,
    SweepConfiguration,
    SweepPatternGenerator,
    KMZGenerator,
    ProjectManager,
    LabelFormat
};