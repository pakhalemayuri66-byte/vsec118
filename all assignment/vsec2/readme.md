# assignment no 2

## 1. What is Git?

Git is a distributed version control system (DVCS) used to track changes in files and manage source code.

It is mainly used by developers to:

Track changes
Maintain different versions
Recover previous versions
Work on different features
Collaborate with other developers

## 2. What is GitHub?

GitHub is an online platform where Git repositories can be stored and shared.

In simple words:

Git = tool used on your computer
GitHub = online platform where your Git project is stored

## 3. What is a Repository?

A repository (repo) is a folder that contains your project files along with Git's version history.

## 4. What is Commit?

A commit is a saved record of changes in your project.

Example:

git add .
git commit -m "Updated CSS design"

The message "Updated CSS design" describes what you changed.

## 5. What is Push?

Push sends your local commits from your computer to GitHub.

git push origin main
Computer → GitHub

## 6. What is Pull?

Pull gets changes from GitHub and brings them to your computer.

git pull origin main
GitHub → Computer
7. What is Clone?

Clone downloads an existing GitHub repository to your computer.

git clone <repository-url>

Example:

GitHub Repository
       ↓
    git clone
       ↓
Your Computer

## 8. What is Branch?
A branch is a separate version or line of development of a project.

It allows you to make changes without directly affecting the main project.

## git commands

Important Git Commands
Command	Use
- git init	        Create a Git repository
- git status	        Check changes
- git add .	        Add all changes to staging
- git add file	    Add a specific file
- git commit -m "message" 	Save changes
- git push	       Upload commits
- git pull	       Get remote changes
- git clone	       Copy a remote repository
- git branch	       View branches
- git branch name	   Create a branch
- git switch name	   Switch branch
- git merge name	   Merge a branch
- git log	View commit  history
- git remote -v	   View remote repository
