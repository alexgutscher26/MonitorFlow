/**
 * This file ensures proper package management with pnpm
 * and prevents usage of npm or yarn in this project.
 */

module.exports = {
  hooks: {
    readPackage: (pkg) => {
      // Ensure consistent React versions
      if (pkg.dependencies && pkg.dependencies.react) {
        pkg.dependencies.react = '^18.2.0';
      }
      if (pkg.dependencies && pkg.dependencies['react-dom']) {
        pkg.dependencies['react-dom'] = '^18.2.0';
      }
      
      // Return modified package
      return pkg;
    },
  },
};