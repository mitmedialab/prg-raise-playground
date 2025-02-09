# Continuous Integration & Deployment

If you followed the steps outlined in the README's [Making an Extension](./README.md#🔨-making-an-extension) section, you should have created a new branch off of the `dev` branch where you implemented your extension. 

## Automatic Deployment to Temperorary URL

Whenever you [push]() on this new branch, a [github action]() will automatically deploy your extension to a URL corresponding to your branch name. 

For example, if my branch is called `myNewExtension`, whenever I succesfully push up code on this branch, I should be able to see my changes at: https://playground.raise.mit.edu/myNewExtension/

> NOTE: The github action(s) that manages deployment can take anywhere from 10 - 30 minutes. View the status of actions in the repo's [Actions tab](https://github.com/mitmedialab/prg-extension-boilerplate/actions). In order for your site to be succesfully deployed, both an action titled with your commmit message and one after it titled ***pages build and deployment*** must complete succesfully. 

Though this branch-specific URL can be very helpful for sharing your extension quickly, we **require** that you don't use this URL for _official_ purposes -- instead you should follow the instructions in [Integrating Your Extension into the main Branch](#integrating-your-extension-into-the-main-branch) if you want to share extension as part of a curricullum, to an outside organization, etc. 

So this means you can use your branch-specific URL to share your extension with colleagues, get feedback, and quickly iterate on your extension. However, if you want to share your extension externally, especially with students, it must first be integrated into the `main` branch, and then you can direct them to: https://playground.raise.mit.edu/main/

## Integrating Your Extension into the `main` Branch

The extensions pushed into the `main` branch should represent all of the extensions PRG officially supports, and thus what PRG is committed to maintaining now and into the future. 

Thus, you should only _officially_ share extensions via the `main` branch and corresponding [main site](https://playground.raise.mit.edu/main/) (https://playground.raise.mit.edu/main/). In other words, if an outside party (student, teacher, organization, etc.) reports a bug about an extension (or the platform), they should be doing so based on their usage of the main site -- not a branch-specific site that no other team members know about. 

By adhering to this practice, as well as a regimented process for [merging](https://git-scm.com/docs/git-merge) changes to the `dev` and `main` branches, we can ensure both the best experinece for our users and the least amount of headache for us as developers / maintainers.

Here's the process for getting your extension into the `main` branch and deployed to https://playground.raise.mit.edu/main/:

1. Get your development branch current with the `dev` branch
    ```bash
    cd prg-extension-boilerplate/ # Change directory (cd) to prg-extension-boilerplate/, if not already there

    git checkout <your branch name> # Checkout your brnahc, if not already checked out

    git pull # Fetch the latest changes from all remote branches. 
    # NOTE: using `git fetch` would do the same, but it's yet another git command to remember...

    git merge origin/dev # Merge the latest changes from the remote (i.e. origin) dev branch into your development branch
    ```
2. Create a Pull Request (PR) from your branch into `dev`
    1. Go to the [Pull Requests tab](https://github.com/mitmedialab/prg-extension-boilerplate/pulls)
    2. Click **New Pull Request** 
    3. Set _base_ to `dev` and _compare_ to the name of your branch
        - The flow should look like: `dev` <-- `<your branch>`
    4. Select **Create Pull Request** 
        - Do this enough times so that the pull request is actually created -- github's UI seems to be a little redunant
3. Set [pmalacho-mit](https://github.com/pmalacho-mit) (Parker Malachowsky) as the reviewer of the PR
    - NOTE: If anyone's interested in being a reviewer please also talk to Parker and he will add you above.
4. Work with your reviewer to get your PR approved, and then **YOUR REVIEWER** will merge your PR and your changes will go into `dev` 🎉🎉🎉.  In this way, you and the reviewer are equally responsible for keeping the `dev` branch bug-free. 
    - Your reviewer will review your code, test your extension, and leave comments for you to respond to.
    - You can speed up the review process by doing the following:
        - Writing readable code and leaving necessary (but [_only necessary_](https://levelup.gitconnected.com/please-dont-comment-your-code-d0830785bdc9)) comments
            - Use [JSDoc comments](https://jsdoc.app/about-getting-started.html) where possible (e.g. on functions, classes, method parameters, etc.)
        - [Writing tests for your extension]() (coming soon)
        - [Creating tutorials for your extension]() (coming soon)
5. Once your code is in `dev`, your work is done! The code base's maintainer (Parker, at this time) will then semiweekly merge the `dev` branch into the `main` branch.
6. Once Parker has notified you that your changes are live, you can direct your audience to the deployed `main` branch: https://playground.raise.mit.edu/main/
    - Check out the [URL Parameters]() section to see how you can customize this link to automatically add your extension, tutorials, demo project, etc. when the page is loaded. 