# COA CONVERSE App

A check-in app for employees and supervisors to set goals and evaluate progress.

## License

This project is licensed under the MIT license. For more information see the [license file](./LICENSE.md)

## Troubleshooting

If an employee's email address changes (e.g. due to a name change), and coa-converse is still using firebase authentication, and the employee had previously logged into coa-converse with the old email address, then there is manual cleanup that must be done. It is simple - the firebase user must be deleted from the auth table. Once that's done, their reccord will automatically be re-created properly when they next log into coa-converse with their new email address.

Location of auth table in the Firebase console:
[firebase-project-root]/authentication/users 
