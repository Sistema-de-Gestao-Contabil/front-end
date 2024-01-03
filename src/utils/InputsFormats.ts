export const formatPhoneNumber = (input: string) => {
  const phoneNumber = input.replace(/\D/g, "");

  if (!phoneNumber) {
    return "";
  }

  const match = phoneNumber.match(/^(\d{2})(\d{1})(\d{0,4})(\d{0,4})$/);

  if (match) {
    console.log(`(${match[1]})`);
    const formattedNumber = `(${match[1]})${match[2] && `${match[2]}`}${
      match[3] && `${match[3]}`
    } ${match[4] && `-${match[4]}`}`;
    return formattedNumber;
  } else {
    return input;
  }
};

export const formatCPF = (input: string) => {
  const cpf = input.replace(/\D/g, "");

  if (!cpf) {
    return "";
  }

  const match = cpf.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

  if (match) {
    // Formatando o número de telefone
    const formattedCPF = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(
      6,
      9
    )}-${cpf.slice(9)}`;
    return formattedCPF;
  } else {
    // Caso a expressão regular não faça match, retornar a string original
    return input;
  }
};
// export const formatNumberAccount = (input: string) => {
//   const numberAccount = input.replace(/\D/g, "");
//   if (!numberAccount) {
//     return "";
//   }

//   const match = numberAccount.match(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/);
//   if (match) {
//     const formattedNumber = `(${match[1]})${match[2] ? ` ${match[2]}` : ""} ${
//       match[3] ? ` ${match[3]}` : ""
//     } ${match[4] ? `-${match[4]}` : ""}`;
//     console.log(formattedNumber);
//   }
//   return "";
// };
