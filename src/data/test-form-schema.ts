export const testFormSchema = {
  formDesigner: {
    components: [
      {
        type: "textfield",
        key: "name",
        label: "Name",
        placeholder: "Enter your name",
        validate: {
          required: true,
        },
      },
      {
        type: "email",
        key: "email",
        label: "Email",
        placeholder: "Enter your email",
        validate: {
          required: true,
        },
      },
      {
        type: "select",
        key: "categories",
        label: "Categories",
        placeholder: "Select categories",
        multiple: true,
        data: {
          values: [
            { label: "Technology", value: "tech" },
            { label: "Business", value: "business" },
            { label: "Arts", value: "arts" },
            { label: "Sports", value: "sports" },
            { label: "Health", value: "health" },
          ],
        },
        validate: {
          required: true,
        },
      },
      {
        type: "textarea",
        key: "description",
        label: "Description",
        placeholder: "Enter a description",
        rows: 3,
      },
      {
        type: "checkbox",
        key: "agree",
        label: "I agree to the terms and conditions",
        validate: {
          required: true,
        },
      },
      {
        type: "htmlelement",
        key: "instructions",
        content:
          "<div><h3>Instructions</h3><p>Please fill out the form carefully.</p></div>",
      },
      {
        type: "columns",
        columns: [
          {
            width: 6,
            components: [
              {
                type: "textfield",
                key: "firstName",
                label: "First Name",
                placeholder: "Enter your first name",
              },
            ],
          },
          {
            width: 6,
            components: [
              {
                type: "textfield",
                key: "lastName",
                label: "Last Name",
                placeholder: "Enter your last name",
              },
            ],
          },
        ],
      },
      {
        type: "panel",
        title: "Additional Information",
        key: "additionalInfo",
        components: [
          {
            type: "textfield",
            key: "phone",
            label: "Phone Number",
            placeholder: "Enter your phone number",
          },
        ],
      },
    ],
    display: "form",
  },
  translations: [
    {
      Keyword: "Name",
      En: "Name",
      Ar: "اسم",
      Fr: "Nom",
    },
    {
      Keyword: "Email",
      En: "Email",
      Ar: "البريد الإلكتروني",
      Fr: "Email",
    },
    {
      Keyword: "Categories",
      En: "Categories",
      Ar: "الفئات",
      Fr: "Catégories",
    },
    {
      Keyword: "Technology",
      En: "Technology",
      Ar: "تكنولوجيا",
      Fr: "Technologie",
    },
    {
      Keyword: "Business",
      En: "Business",
      Ar: "أعمال",
      Fr: "Affaires",
    },
    {
      Keyword: "Arts",
      En: "Arts",
      Ar: "فنون",
      Fr: "Arts",
    },
    {
      Keyword: "Sports",
      En: "Sports",
      Ar: "رياضة",
      Fr: "Sports",
    },
    {
      Keyword: "Health",
      En: "Health",
      Ar: "صحة",
      Fr: "Santé",
    },
    {
      Keyword: "Description",
      En: "Description",
      Ar: "وصف",
      Fr: "Description",
    },
    {
      Keyword: "I agree to the terms and conditions",
      En: "I agree to the terms and conditions",
      Ar: "أوافق على الشروط والأحكام",
      Fr: "J'accepte les termes et conditions",
    },
    {
      Keyword: "Instructions",
      En: "Instructions",
      Ar: "تعليمات",
      Fr: "Instructions",
    },
    {
      Keyword: "Please fill out the form carefully.",
      En: "Please fill out the form carefully.",
      Ar: "يرجى ملء النموذج بعناية.",
      Fr: "Veuillez remplir le formulaire avec soin.",
    },
    {
      Keyword: "First Name",
      En: "First Name",
      Ar: "الاسم الأول",
      Fr: "Prénom",
    },
    {
      Keyword: "Last Name",
      En: "Last Name",
      Ar: "اسم العائلة",
      Fr: "Nom de famille",
    },
    {
      Keyword: "Additional Information",
      En: "Additional Information",
      Ar: "معلومات إضافية",
      Fr: "Informations complémentaires",
    },
    {
      Keyword: "Phone Number",
      En: "Phone Number",
      Ar: "رقم الهاتف",
      Fr: "Numéro de téléphone",
    },
  ],
};
