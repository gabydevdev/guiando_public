#### 2.0.0 (2025-01-16)

##### Chores

*  update dependencies in package.json (2edc20cd)
*  remove .gitignore file to clean up repository (8129e8ff)
*  update .gitignore (740838c3)

##### New Features

* **data:**  add baseUrl from environment variable to global config (a3fc3855)
*  add helper functions for link active state and parent, refactor menu and sidebar templates to use new helpers (de71a7f7)
*  add sprucecss dependency and update webpack config for BASE_URL_PATH (c2dde498)
* **layout:**
  *  add Alpine.js x-data attribute for sidebar state management (5a6b55ae)
  *  update container and main styles, add row component (8fb12d25)
* **global:**  add random UUID and current year utility functions (6d296cab)

##### Bug Fixes

* **menu:**  prepend baseUrl to links for correct navigation (e812a81d)
*  console statement in webpack print the correct environment variable BASE_URL to display the user. (beacf405)

##### Other Changes

* **getLinkActiveState.js:**  remove console.log statements * fix(menu.hbs): update pageUrl variable to currentPageUrl * fix(sidebar.hbs): update pageUrl variable to currentPageUrl * refactor(webpack.config.js): remove unnecessary console.log statements (f5409337)
* **icons:**  add close.svg icon * chore(icons): remove unused notification icons * chore(icons): remove unused sorting icons * chore(icons): remove unused top tray icons (a852afea)
*  update dependencies in package.json (05c12915)
*  enable live reload in webpack dev server configuration (6e37ecb4)
*  implement new form layout and update header, footer, and sidebar structure (b15b029a)
*  update package.json (1b4723db)
* **index.scss:**  reorganize imports and update CSS variables in :root * style(index.scss): add styles for body, x-cloak, and reorganize imports * feat(sections): add new styles for app actions and body * feat(sections): create new files for header, heading, sidebar, and footer styles * feat(sections): add index file to forward new section styles (f7754747)
* **styles:**  add block-navigation component and update card styles (fd53c775)
* **data:**  update global.js to use 'pages' array instead of 'menuItems' * feat(pages): add new 'Requests' page with associated files * feat(pages): rename 'about/index.hbs' to 'about.hbs' * feat(pages): add 'about.js' script for about page * feat(pages): add 'index' and 'requests' pages with associated files * feat(partials): update footer.hbs with new site-footer structure * feat(partials): update header.hbs with new site-header structure * feat(scripts): add apiManager.js for fetching data from API * feat(scripts): add index.js for main script functionality * feat(styles): add new component files for card, data-table, pagination, and skip-link * feat(styles): add configuration files for base, config, dark-colors, normalize, and root * feat(styles): add helper files for display and margin * feat(styles): add layout files for container and main * feat(styles): add main files for content, (eb510960)

##### Refactors

*  update HTML structure and adjust CSS variables for layout consistency (6c2a6460)
*  rename index page files to home and update layout structure (c7744249)
*  add logging for URL comparison and update menu partial to accept currentPageUrl (02da4eda)
* **webpack:**  clean up logging and simplify data configuration (b529707b)
* **partials:**  create reusable logo partial and update header and sidebar usage (ff6e00f1)
* **styles:**  restructure and update configuration files (bd85566e)

##### Code Style Changes

* **sidebar:**  update logo display and adjust spacing properties (b3924f68)
*  reformat DefinePlugin configuration in webpack config (e3e90796)
*  reorder start and build scripts in package.json (7f69c766)
*  update color values to lowercase in dark theme config (339065d4)
*  update dark in _dark-colors.scss (bfceae23)

