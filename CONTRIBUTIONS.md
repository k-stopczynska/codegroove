![Logo](https://lh3.googleusercontent.com/pw/ABLVV84c8y_tHsJ5SbllNNGjJGayY5_8zplFezCUcFX9alKM0StPw0L3tNO4U0y--fbx_fuVgp2ZV1SNOsD63ocbZTpWe9icjPCuWJRjLr4pQVzsj9g7jHc=s125-p-k)

Hello, and welcome to codegroove, where every contribution matters

## Important Resources

-   docs: in every project's file you will find docsrings provided for documentation of classes, methods and functions
-   bugs, new features, questions, comms: you are more than welcomed to create a GitHub issue for those, details in below sections
-   bugs: in order to report a bug create a GitHub issue: https://github.com/k-stopczynska/codegroove/issues and label it as a bug
-   new features: create a GitHub issue: https://github.com/k-stopczynska/codegroove/issues and label it as an enhancement
-   questions: create a GitHub issue: https://github.com/k-stopczynska/codegroove/issues and label it as a question

## Environment details

After forking this repository:

```bash
  git clone https://github.com/<your-github-name>/codegroove.git
```

Go to the project directory

```bash
  cd codegroove
```

Install dependencies

```bash
  npm install
```

Start the development plugin

```bash
  press F5
```

If in need to run developer tools for plugin, in development host type:

```bash
  Ctrl + Shift + P and Ctrl + Shift + I
```

## Testing

-   tests are run in Mocha and Chai with help of ts-mockito
-   you can find them in src/test
-   in order to run tests type in your terminal

```bash
npm run test
```

## Reporting bugs

#### Create a report to help us improve :)

-   before reporting a bug check if similar report doesn't exist
-   also if the newer version exists- check if your problem still appears there
-   create a GitHub issue: https://github.com/k-stopczynska/codegroove/issues and label it as a bug
-   follow the bug-template:

    -Description: short description of a bug

    -Steps to Reproduce: concise step-by-step description

    -Expected behavior: how you wanted codegroove to handle the situation

    -Actual behavior: what behavior was unexpected/ unwanted

    -Reproduces how often: how many times this problem occured

    -Versions: in which version of codegroove does this happen (you can find ver sion in package.json under "version")

    -Additional Information: anything you want to add

## How to request new feature?

#### Which way do you want codegroove to grow?

-   before requsting enhancement check if similar feature report doesn't exist
-   create a GitHub issue: https://github.com/k-stopczynska/codegroove/issues and label it as an enhancement
-   follow the new feature-template:

    -Summary: short description what enhancement you are proposing

    -Motivation: why do you want this feature

    -Describe alternatives you've considered: are there any other vscode plugins that do this already

    -Additional context: anything you want to add

## How to submit changes?

#### Issues you can submit are labeled: good first issue or help wanted. They can be a minor change in documentation, fixing typos, providing test case, fixing a bug or adding new feature. Even if you are a beginner, you can find something to contribute to :)

Please follow these steps to have your contribution reviewed:

-   Follow the template:

    -Issue No. and title: title and number of the issue you are helping with

    -Description of the Change: few points what changes you have made

    -Release Notes: change explanation for the CHANGELOG file

-   Follow the styleguides
-   After you submit your pull request, verify that all status checks are passing

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## How to ask questions?

#### Share any comments or questions not falling into above categories

-   create a GitHub issue: https://github.com/k-stopczynska/codegroove/issues and label it as a question

## Styleguides

#### Just so we are all on the same side

### Git Commit Messages

-   Use the past tense ("Added feature" not "Add feature")
-   Use the declarative mood ("Moves cursor to..." not "Move cursor to...")
-   Limit the first line to 72 characters or less

### JavaScript Styleguide

-   Prefer the object spread operator ({...anotherObj}) to Object.assign()
-   Inline name exports with expressions whenever possible

Use this:

```javascript
export class ClassName {}
```

Instead of:

```
class ClassName {
}
export default ClassName
```

-   Place requires in the following order:

    -vscode Modules (such as vscode)

    -Built in Node Modules (such as path)

    -Local Modules (using relative paths)

-   Place class properties in the following order:
    public properties, protected properties, private properties, methods in order of appearance (method definition before method execution)

-   Avoid platform-dependent code

-   Add docstrings for new methods as a form of documentation

-   Use spaces around operators

```javascript
count + 1 instead of  count+1
```

-   Include a single line of whitespace between methods

-   Avoid spaces inside the curly-braces of objects:

```javascript
{a: 1, b: 2} instead of { a: 1, b: 2 }
```
