import type { PlopTypes } from "@turbo/gen";

const PATH_WEB_APP = "apps/web";

const moduleChoices: { id: string; name: string }[] = [
  { id: "auth", name: "User Management" },
  { id: "product", name: "Product & Shopping" },
  { id: "payment", name: "Payment & Checkout" },
  { id: "delivery", name: "Delivery & Store Services" },
  { id: "loyalty", name: "Loyalty & Rewards" },
  { id: "admin", name: "Admin & Analytics" },
];

const featureChoices = (module: string) => {
  switch (module) {
    case "User Management":
      return ["Login", "Register", "ForgotPassword"];
    case "Product & Shopping":
      return ["ProductList", "Cart", "Checkout"];
    case "Payment & Checkout":
      return ["PaymentGateway", "OrderSummary"];
    case "Delivery & Store Services":
      return ["StoreLocator", "DeliveryTracking"];
    case "Loyalty & Rewards":
      return ["RewardsDashboard", "LoyaltyPoints"];
    case "Admin & Analytics":
      return ["AdminPanel", "SalesAnalytics"];
    default:
      return [];
  }
};

const validate = (value: string) => {
  const validAnswers = ["ya", "tidak"];
  if (validAnswers.includes(value.toLowerCase())) {
    return true;
  }
  return 'Jawaban harus "ya" atau "tidak"';
};

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("Templating Frontend Dev Pasjajan", {
    description: "Pilih modul yang anda kerjakan",
    prompts: async (inquirer) => {
      let confirmed = false;
      let answers: any = {};

      while (!confirmed) {
        answers = await inquirer.prompt([
          {
            type: "rawlist",
            name: "module",
            message: "Pilih modul yang anda kerjakan",
            choices: moduleChoices.map((mod) => mod.name),
            validate: (value) => (value ? true : "Modul harus dipilih!"),
          },
          {
            when: (answer) => answer.module,
            type: "confirm",
            name: "withLayout",
            message: (answer) =>
              `Apakah modul ${answer.module} menggunakan layout khusus?`,
            default: false,
          },
          {
            when: (answer) => answer.module,
            type: "input",
            name: "featureName",
            message: (answer) =>
              `Nama fitur/halaman apa? (contoh: ${featureChoices(answer.module).join(", ")}) `,
            suffix:
              "gunakan '/' untuk sub-fitur/sub-halaman (misal: AdminPanel/UserManagement): ",
            validate: (value) =>
              value ? true : "Nama fitur tidak boleh kosong!",
          },
          {
            when: (answer) => answer.module,
            type: "confirm",
            name: "withDetailPage",
            message: (answer) =>
              `Apakah fitur ${answer.featureName} memiliki halaman detail? (contoh: product/{id})`,
            default: false,
          },
          {
            when: (answer) => answer.module,
            type: "confirm",
            name: "withParams",
            message: (answer) =>
              `Apakah fitur ${answer.featureName} memiliki parameter dinamis? (contoh: product?search=cokelat)`,
            default: false,
          },
          {
            when: (answer) => answer.module,
            type: "confirm",
            name: "withHooks",
            message: (answer) =>
              `Apakah fitur ${answer.featureName} menggunakan custom hooks?`,
            default: false,
          },
          {
            when: (answer) => answer.module,
            type: "confirm",
            name: "withStateManagement",
            message: (answer) =>
              `Apakah fitur ${answer.featureName} menggunakan state management?`,
            default: false,
          },
        ]);

        console.log("\nRingkasan pilihan:");
        console.log(`  Modul         : ${answers.module}`);
        console.log(`  Layout Khusus : ${answers.withLayout ? "Yes" : "No"}`);
        console.log(`  Fitur         : ${answers.featureName}`);
        console.log(
          `  Detail Page   : ${answers.withDetailPage ? "Yes" : "No"}`
        );
        console.log(`  Dengan Params : ${answers.withParams ? "Yes" : "No"}`);
        console.log(`  Custom Hooks  : ${answers.withHooks ? "Yes" : "No"}`);
        console.log(
          `  State Mgmt    : ${answers.withStateManagement ? "Yes" : `No`}`
        );

        const { confirm } = await inquirer.prompt({
          type: "list",
          name: "confirm",
          message: "Apakah semua sudah benar?",
          choices: [
            { name: "Ya, lanjut generate", value: "yes" },
            { name: "Belum, isi ulang prompt", value: "no" },
          ],
        });

        confirmed = confirm === "yes";
      }

      return answers;
    },
    actions: (data) => {
      const actions: PlopTypes.ActionType[] = [];

      if (data?.withLayout) {
        const moduleId = moduleChoices.find(
          (mod) => mod.name === data?.module
        )?.id;
        const layoutPath = `${PATH_WEB_APP}/app/(${moduleId})/${data?.featureName}`;
        actions.push({
          type: "add",
          path: `${layoutPath}/layout.tsx`,
          templateFile: "templates/layout.tsx.hbs",
        });
      }

      if (data?.withHooks) {
        const hooksPath = `${PATH_WEB_APP}/hooks`;
        actions.push({
          type: "add",
          path: `${hooksPath}/use{{pascalCase featureName}}.ts`,
          templateFile: "templates/hooks.ts.hbs",
        });
      }

      if (data?.withStateManagement) {
        const statePath = `${PATH_WEB_APP}/store`;
        actions.push({
          type: "add",
          path: `${statePath}/use{{pascalCase featureName}}Store.ts`,
          templateFile: "templates/store.ts.hbs",
        });
      }

      const featurePath = data?.withDetailPage
        ? `${PATH_WEB_APP}/app/(${moduleChoices.find((mod) => mod.name === data?.module)?.id})/${data?.featureName}/[id]`
        : `${PATH_WEB_APP}/app/(${moduleChoices.find((mod) => mod.name === data?.module)?.id})/${data?.featureName}`;
      actions.push({
        type: "add",
        path: `${featurePath}/page.tsx`,
        templateFile: "templates/fitur.tsx.hbs",
      });

      return actions;
    },
  });
}
