// import {
//   registerDecorator,
//   ValidationArguments,
//   ValidationOptions,
// } from 'class-validator';

// /** very light password check: at least one letter + one number */
// export function IsStrongPasswordLite(options?: ValidationOptions) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       name: 'IsStrongPasswordLite',
//       target: object.constructor,
//       propertyName,
//       options,
//       validator: {
//         validate(value: any) {
//           if (typeof value !== 'string') return false;
//           return /[A-Za-z]/.test(value) && /[0-9]/.test(value);
//         },
//         defaultMessage(args?: ValidationArguments) {
//           return `${args?.property} must include letters and numbers`;
//         },
//       },
//     });
//   };
// }
