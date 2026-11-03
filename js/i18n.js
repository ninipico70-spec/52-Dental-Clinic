(() => {
  const translations = {
    'Happy day': 'សូមស្វាគមន៍',
    'Language': 'ភាសា',
    'Language / ភាសា': 'ភាសា / Language',
    'English': 'អង់គ្លេស',
    'Main': 'ទំព័រដើម',
    '🏠 Main': '🏠 ទំព័រដើម',
    'new patient': 'អ្នកជំងឺថ្មី',
    '➕ new patient': '➕ អ្នកជំងឺថ្មី',
    'Payments': 'ការទូទាត់',
    '💳 Payments': '💳 ការទូទាត់',
    '🧾 Billing & Invoices': '🧾 វិក្កយបត្រ និងការទូទាត់',
    'Expenses': 'ចំណាយ',
    '📎 Expenses': '📎 ចំណាយ',
    'search': 'ស្វែងរក',
    '🔍 search': '🔍 ស្វែងរក',
    'User Management': 'ការគ្រប់គ្រងអ្នកប្រើប្រាស់',
    '👤 User Management': '👤 ការគ្រប់គ្រងអ្នកប្រើប្រាស់',
    'Feature & Role Permissions': 'សិទ្ធិមុខងារ និងតួនាទី',
    'Settings': 'ការកំណត់',
    '🔧 Settings': '🔧 ការកំណត់',
    '🦷 Services': '🦷 សេវាកម្ម',
    'Services': 'សេវាកម្ម',
    'Doctor': 'គ្រូពេទ្យ',
    'Assistant': 'ជំនួយការ',
    'Receptionist': 'អ្នកទទួលភ្ញៀវ',
    'receptionist': 'អ្នកទទួលភ្ញៀវ',
    'sign out': 'ចាកចេញ',
    '⎋ sign out': '⎋ ចាកចេញ',
    'Payments today': 'ការទូទាត់ថ្ងៃនេះ',
    'box (today)': 'សាច់ប្រាក់ថ្ងៃនេះ',
    'The patients': 'អ្នកជំងឺ',
    'Appointments today': 'ការណាត់ជួបថ្ងៃនេះ',
    "Today's reviews": 'ការពិនិត្យថ្ងៃនេះ',
    'Appointments': 'ការណាត់ជួប',
    'files': 'ឯកសារ',
    'Reports': 'របាយការណ៍',
    'box': 'សាច់ប្រាក់',
    'Pictures': 'រូបភាព',
    'New file': 'ឯកសារថ្មី',
    'new patient |': 'អ្នកជំងឺថ្មី |',
    'Telephone number': 'លេខទូរស័ព្ទ',
    'Patient name': 'ឈ្មោះអ្នកជំងឺ',
    'Gender': 'ភេទ',
    '===Choose a gender==': '===ជ្រើសរើសភេទ==',
    'Male': 'ប្រុស',
    'Female': 'ស្រី',
    'note': 'កំណត់ចំណាំ',
    'Note': 'កំណត់ចំណាំ',
    'Save file': 'រក្សាទុកឯកសារ',
    'Patient files |': 'ឯកសារអ្នកជំងឺ |',
    'The patients / Patient records': 'អ្នកជំងឺ / កំណត់ត្រាអ្នកជំងឺ',
    'File date from': 'កាលបរិច្ឆេទឯកសារចាប់ពី',
    'Action': 'សកម្មភាព',
    'File History': 'ប្រវត្តិឯកសារ',
    'File No': 'លេខឯកសារ',
    'patient number': 'លេខអ្នកជំងឺ',
    'View file': 'មើលឯកសារ',
    'Edit file': 'កែសម្រួលឯកសារ',
    'delete file': 'លុបឯកសារ',
    'No patient files match. Try a different name or clear the date.': 'រកមិនឃើញឯកសារអ្នកជំងឺទេ។ សូមសាកល្បងឈ្មោះផ្សេង ឬលុបកាលបរិច្ឆេទចេញ។',
    'Delete this patient file and all its sessions and payments?': 'តើអ្នកចង់លុបឯកសារអ្នកជំងឺនេះ រួមទាំងវគ្គព្យាបាល និងការទូទាត់ទាំងអស់មែនទេ?',
    'Delete this patient file?': 'តើអ្នកចង់លុបឯកសារអ្នកជំងឺនេះមែនទេ?',
    'Delete this session?': 'តើអ្នកចង់លុបវគ្គព្យាបាលនេះមែនទេ?',
    'File deleted': 'បានលុបឯកសារ',
    'File saved': 'បានរក្សាទុកឯកសារ',
    'edit file': 'កែសម្រួលឯកសារ',
    'patient file': 'ឯកសារអ្នកជំងឺ',
    'entry date': 'កាលបរិច្ឆេទបញ្ចូល',
    "patient's gender": 'ភេទរបស់អ្នកជំងឺ',
    "Doctor's notes": 'កំណត់ចំណាំរបស់គ្រូពេទ្យ',
    'Save changes': 'រក្សាទុកការផ្លាស់ប្តូរ',
    'sessions': 'វគ្គព្យាបាល',
    'the details': 'ព័ត៌មានលម្អិត',
    'session date': 'កាលបរិច្ឆេទវគ្គព្យាបាល',
    'delete session': 'លុបវគ្គព្យាបាល',
    'View details': 'មើលព័ត៌មានលម្អិត',
    'No sessions yet. Add the first one.': 'មិនទាន់មានវគ្គព្យាបាលទេ។ សូមបន្ថែមវគ្គដំបូង។',
    'the procedures': 'ប្រតិបត្តិការ',
    'add session': 'បន្ថែមវគ្គព្យាបាល',
    'Account statement': 'របាយការណ៍គណនី',
    'Debt amount': 'ចំនួនជំពាក់',
    'number of sessions': 'ចំនួនវគ្គព្យាបាល',
    'total payment': 'ការទូទាត់សរុប',
    'Date': 'កាលបរិច្ឆេទ',
    'Type': 'ប្រភេទ',
    'Batch': 'លេខយោង',
    'Amount': 'ចំនួនទឹកប្រាក់',
    'There are no payments': 'មិនទាន់មានការទូទាត់ទេ',
    'Payment amount': 'ចំនួនទឹកប្រាក់ទូទាត់',
    'batch number': 'លេខយោង',
    'Cash': 'សាច់ប្រាក់',
    'Card': 'កាត',
    'Transfer': 'ផ្ទេរប្រាក់',
    'Record payment': 'កត់ត្រាការទូទាត់',
    'Billing & Invoices': 'វិក្កយបត្រ និងការទូទាត់',
    'Invoices': 'វិក្កយបត្រ',
    'Create invoice': 'បង្កើតវិក្កយបត្រ',
    'Invoice': 'វិក្កយបត្រ',
    'Invoice total': 'សរុបវិក្កយបត្រ',
    'Invoice created': 'បានបង្កើតវិក្កយបត្រ',
    'Invoice not found.': 'រកមិនឃើញវិក្កយបត្រទេ។',
    'Invoice status': 'ស្ថានភាពវិក្កយបត្រ',
    'unpaid': 'មិនទាន់បង់',
    'partially paid': 'បានបង់មួយផ្នែក',
    'paid': 'បានបង់រួច',
    'overdue': 'ហួសកាលកំណត់',
    'void': 'បានបោះបង់',
    'Total': 'សរុប',
    'Subtotal': 'សរុបរង',
    'Discount': 'បញ្ចុះតម្លៃ',
    'Balance due': 'សមតុល្យត្រូវបង់',
    'Paid': 'បានបង់',
    'Refunded': 'បានសងប្រាក់វិញ',
    'Payment history': 'ប្រវត្តិការទូទាត់',
    'Refund history': 'ប្រវត្តិការសងប្រាក់វិញ',
    'Record refund': 'កត់ត្រាការសងប្រាក់វិញ',
    'Refund recorded': 'បានកត់ត្រាការសងប្រាក់វិញ',
    'Void invoice': 'បោះបង់វិក្កយបត្រ',
    'Invoice voided': 'បានបោះបង់វិក្កយបត្រ',
    'Void this invoice?': 'តើអ្នកពិតជាចង់បោះបង់វិក្កយបត្រនេះឬ?',
    'Print invoice': 'បោះពុម្ពវិក្កយបត្រ',
    'Back to invoices': 'ត្រឡប់ទៅវិក្កយបត្រ',
    'Add item': 'បន្ថែមធាតុ',
    'Item or service description': 'ការពិពណ៌នាធាតុ ឬសេវាកម្ម',
    'Unit price': 'តម្លៃក្នុងមួយឯកតា',
    'Quantity': 'បរិមាណ',
    'Issue date': 'កាលបរិច្ឆេទចេញ',
    'Due date (optional)': 'កាលបរិច្ឆេទកំណត់ (ជាជម្រើស)',
    'Discount ($)': 'បញ្ចុះតម្លៃ ($)',
    'No invoices found.': 'រកមិនឃើញវិក្កយបត្រទេ។',
    'No payments recorded.': 'មិនទាន់មានការទូទាត់ទេ។',
    'No refunds recorded.': 'មិនទាន់មានការសងប្រាក់វិញទេ។',
    'Record payments from the invoice to track balances and partial payments.': 'សូមកត់ត្រាការទូទាត់ក្នុងវិក្កយបត្រ ដើម្បីតាមដានសមតុល្យ និងការបង់មួយផ្នែក។',
    'Refund all recorded invoice payments before voiding this invoice.': 'សូមសងប្រាក់ការទូទាត់វិក្កយបត្រទាំងអស់ជាមុនសិន មុនពេលបោះបង់វិក្កយបត្រនេះ។',
    'A void invoice cannot receive payments.': 'មិនអាចទទួលការទូទាត់សម្រាប់វិក្កយបត្រដែលបានបោះបង់ទេ។',
    'A zero-value session cannot be invoiced.': 'មិនអាចបង្កើតវិក្កយបត្រសម្រាប់វគ្គព្យាបាលដែលមានតម្លៃសូន្យទេ។',
    'Payment exceeds the invoice balance of': 'ចំនួនទូទាត់លើសសមតុល្យវិក្កយបត្រ',
    'Refund exceeds the refundable amount of': 'ចំនួនសងប្រាក់លើសចំនួនដែលអាចសងវិញ',
    'Invoice payments must be reversed using the invoice refund action.': 'ត្រូវកត់ត្រាសងប្រាក់វិញក្នុងវិក្កយបត្រ ដើម្បីកែតម្រូវការទូទាត់នេះ។',
    'PDF Download': 'ទាញយក PDF',
    'Send to an email': 'ផ្ញើតាមអ៊ីមែល',
    'Detection printing': 'បោះពុម្ព',
    'Tooth surfaces': 'ផ្ទៃធ្មេញ',
    'Select a tooth': 'ជ្រើសរើសធ្មេញ',
    'Condition tooth': 'ស្ថានភាពធ្មេញ',
    'Normal': 'ធម្មតា',
    'Bad': 'ខូច',
    'Extracted': 'បានដក',
    'Traded': 'បានជំនួស',
    'Cares': 'ពុកធ្មេញ',
    'Coron': 'គ្របធ្មេញ',
    'Implant': 'ដាក់បង្គោលធ្មេញ',
    'RR': 'ព្យាបាលឫសធ្មេញ',
    'mobility': 'ធ្មេញរលុង',
    'X-RAY': 'ថតកាំរស្មីអ៊ិច',
    'Impacted': 'ធ្មេញកប់',
    'XOP': 'វះកាត់ដកធ្មេញ',
    'RCT': 'ព្យាបាលឫសធ្មេញ',
    'C&C': 'សម្អាត និងប៉ះធ្មេញ',
    'Details': 'ព័ត៌មានលម្អិត',
    'Note for the selected tooth': 'កំណត់ចំណាំសម្រាប់ធ្មេញដែលបានជ្រើសរើស',
    'Session': 'វគ្គព្យាបាល',
    'Session date': 'កាលបរិច្ឆេទវគ្គព្យាបាល',
    'Cost': 'តម្លៃ',
    'Session notes': 'កំណត់ចំណាំវគ្គព្យាបាល',
    'Save session': 'រក្សាទុកវគ្គព្យាបាល',
    'Back to file': 'ត្រឡប់ទៅឯកសារ',
    'Select a tooth first': 'សូមជ្រើសរើសធ្មេញជាមុនសិន',
    'Session saved': 'បានរក្សាទុកវគ្គព្យាបាល',
    'Invoice due date (optional)': 'កាលបរិច្ឆេទកំណត់វិក្កយបត្រ (ជាជម្រើស)',
    'Print session': 'បោះពុម្ពវគ្គព្យាបាល',
    'research 🔍': 'ស្វែងរក 🔍',
    'Payment date': 'កាលបរិច្ឆេទទូទាត់',
    'Payment value': 'លេខយោងទូទាត់',
    'the customer': 'អតិថិជន',
    'No payments found.': 'រកមិនឃើញការទូទាត់ទេ។',
    'Delete this payment?': 'តើអ្នកចង់លុបការទូទាត់នេះមែនទេ?',
    'Delete': 'លុប',
    'Title': 'ចំណងជើង',
    'title': 'ចំណងជើង',
    'Add expense': 'បន្ថែមចំណាយ',
    'Expense saved': 'បានរក្សាទុកចំណាយ',
    'No expenses yet. Add the first one above.': 'មិនទាន់មានចំណាយទេ។ សូមបន្ថែមចំណាយដំបូងខាងលើ។',
    'Delete this expense?': 'តើអ្នកចង់លុបចំណាយនេះមែនទេ?',
    'Appointment booked': 'បានកក់ការណាត់ជួប',
    'Book appointment': 'កក់ការណាត់ជួប',
    'Day': 'ថ្ងៃ',
    'Time': 'ម៉ោង',
    'Patient': 'អ្នកជំងឺ',
    'Phone': 'ទូរស័ព្ទ',
    'Reason': 'មូលហេតុ',
    'Status': 'ស្ថានភាព',
    'Done': 'រួចរាល់',
    'Cancel': 'បោះបង់',
    'No appointments for this day.': 'មិនមានការណាត់ជួបនៅថ្ងៃនេះទេ។',
    'Cash in box': 'សាច់ប្រាក់ក្នុងប្រអប់',
    'Sessions today': 'វគ្គព្យាបាលថ្ងៃនេះ',
    'Month': 'ខែ',
    'Income': 'ចំណូល',
    'Net': 'សរុបសុទ្ធ',
    'No payments or expenses recorded yet.': 'មិនទាន់មានការកត់ត្រាការទូទាត់ ឬចំណាយទេ។',
    'Name': 'ឈ្មោះ',
    'E-mail': 'អ៊ីមែល',
    'Password': 'ពាក្យសម្ងាត់',
    'Password (8+ characters)': 'ពាក្យសម្ងាត់ (យ៉ាងតិច ៨ តួអក្សរ)',
    'Add user': 'បន្ថែមអ្នកប្រើប្រាស់',
    'Active': 'សកម្ម',
    'Disabled': 'បានបិទ',
    'Disable': 'បិទ',
    'Enable': 'បើក',
    'User added': 'បានបន្ថែមអ្នកប្រើប្រាស់',
    'Profile': 'ប្រវត្តិរូប',
    'Profile photo': 'រូបថតប្រវត្តិរូប',
    'Profile photo preview': 'មើលរូបថតប្រវត្តិរូបជាមុន',
    'Select Service': 'ជ្រើសរើសសេវាកម្ម',
    'Choose treatment': 'ជ្រើសរើសការព្យាបាល',
    'Checkup': 'ពិនិត្យធ្មេញ',
    'Cleaning': 'សម្អាតធ្មេញ',
    'Filling': 'ប៉ះធ្មេញ',
    'Root Canal': 'ព្យាបាលឫសធ្មេញ',
    'Extraction': 'ដកធ្មេញ',
    'Whitening': 'ធ្វើឱ្យធ្មេញស',
    'Consultation': 'ប្រឹក្សាយោបល់',
    'Orthodontics': 'ពត់តម្រង់ធ្មេញ',
    'Selected duration': 'រយៈពេលសរុប',
    'Session total': 'តម្លៃវគ្គសរុប',
    'Additional cost': 'ថ្លៃបន្ថែម',
    'No services available.': 'មិនទាន់មានសេវាកម្មទេ។',
    'Only admins can manage services.': 'មានតែអ្នកគ្រប់គ្រងប៉ុណ្ណោះដែលអាចគ្រប់គ្រងសេវាកម្មបាន។',
    'Set treatment prices and appointment durations. New services start at $0.00; configure prices before adding them to a session.': 'កំណត់តម្លៃ និងរយៈពេលសេវាព្យាបាល។ សេវាកម្មថ្មីចាប់ផ្តើមតម្លៃ $0.00។ សូមកំណត់តម្លៃមុនបន្ថែមទៅក្នុងវគ្គព្យាបាល។',
    'Service name': 'ឈ្មោះសេវាកម្ម',
    'Icon (emoji)': 'រូបតំណាង (អ៊ីមូជី)',
    'Duration in minutes': 'រយៈពេលគិតជានាទី',
    'Duration (min)': 'រយៈពេល (នាទី)',
    'Price ($)': 'តម្លៃ ($)',
    'Price': 'តម្លៃ',
    'Inactive': 'អសកម្ម',
    'Add service': 'បន្ថែមសេវាកម្ម',
    'Save': 'រក្សាទុក',
    'Deactivate': 'បិទដំណើរការ',
    'Activate': 'បើកដំណើរការ',
    'Service added': 'បានបន្ថែមសេវាកម្ម',
    'Service saved': 'បានរក្សាទុកសេវាកម្ម',
    'Service deactivated': 'បានបិទសេវាកម្ម',
    'Service activated': 'បានបើកសេវាកម្ម',
    'Enter a service name, a duration from 1 to 1440 minutes, and a valid non-negative price.': 'សូមបញ្ចូលឈ្មោះសេវាកម្ម រយៈពេលពី ១ ដល់ ១៤៤០ នាទី និងតម្លៃត្រឹមត្រូវដែលមិនតិចជាងសូន្យ។',
    'One or more selected services are unavailable. Refresh the page and try again.': 'សេវាកម្មមួយឬច្រើនដែលបានជ្រើសរើសមិនអាចប្រើបានទេ។ សូមផ្ទុកទំព័រឡើងវិញ ហើយសាកល្បងម្ដងទៀត។',
    'JPG, PNG or WebP; images are cropped and resized before upload.': 'អាចប្រើរូបភាព JPG, PNG ឬ WebP។ រូបភាពនឹងត្រូវកាត់ និងប្ដូរទំហំមុនពេលផ្ទុកឡើង។',
    'Save photo': 'រក្សាទុករូបថត',
    'Remove photo': 'លុបរូបថត',
    'Change password': 'ប្ដូរពាក្យសម្ងាត់',
    'Current password': 'ពាក្យសម្ងាត់បច្ចុប្បន្ន',
    'New password (8+ characters)': 'ពាក្យសម្ងាត់ថ្មី (យ៉ាងតិច ៨ តួអក្សរ)',
    'Profile photo saved': 'បានរក្សាទុករូបថតប្រវត្តិរូប',
    'Password changed': 'បានប្ដូរពាក្យសម្ងាត់',
    'Printing template': 'គំរូបោះពុម្ព',
    'This clinic-wide template appears on printed patient sessions and account statements.': 'គំរូនេះប្រើរួមទូទាំងគ្លីនិក សម្រាប់ការបោះពុម្ពវគ្គព្យាបាល និងរបាយការណ៍គណនីអ្នកជំងឺ។',
    'Clinic printing templates are managed by an administrator.': 'គំរូបោះពុម្ពគ្លីនិកត្រូវបានគ្រប់គ្រងដោយអ្នកគ្រប់គ្រង។',
    'Print header': 'បឋមកថាបោះពុម្ព',
    'Print footer': 'បាតកថាបោះពុម្ព',
    'Layout': 'ប្លង់',
    'None': 'គ្មាន',
    'Text only': 'អត្ថបទប៉ុណ្ណោះ',
    'Image only': 'រូបភាពប៉ុណ្ណោះ',
    'Text + Image': 'អត្ថបទ + រូបភាព',
    'Custom text': 'អត្ថបទផ្ទាល់ខ្លួន',
    'Enter text; line breaks are kept': 'បញ្ចូលអត្ថបទ; ការចុះបន្ទាត់នឹងត្រូវបានរក្សាទុក',
    'Upload image': 'ផ្ទុករូបភាពឡើង',
    'JPG, PNG or WebP; images are resized to fit a print header or footer.': 'អាចប្រើរូបភាព JPG, PNG ឬ WebP។ រូបភាពនឹងត្រូវប្ដូរទំហំឱ្យសមនឹងបឋមកថា ឬបាតកថាបោះពុម្ព។',
    'Print header image preview': 'មើលរូបភាពបឋមកថាបោះពុម្ពជាមុន',
    'Print footer image preview': 'មើលរូបភាពបាតកថាបោះពុម្ពជាមុន',
    'Remove image': 'លុបរូបភាព',
    'Save print template': 'រក្សាទុកគំរូបោះពុម្ព',
    'Print template saved': 'បានរក្សាទុកគំរូបោះពុម្ព',
    'Choose a valid header and footer layout, enter text under 2000 characters, and upload valid images for image layouts.': 'សូមជ្រើសរើសប្លង់បឋមកថា និងបាតកថាត្រឹមត្រូវ បញ្ចូលអត្ថបទក្រោម ២០០០ តួអក្សរ និងផ្ទុករូបភាពត្រឹមត្រូវសម្រាប់ប្លង់ដែលប្រើរូបភាព។',
    'Image is too detailed. Choose a smaller or simpler image.': 'រូបភាពមានព័ត៌មានលម្អិតច្រើនពេក។ សូមជ្រើសរើសរូបភាពតូចជាង ឬសាមញ្ញជាងនេះ។',
    'Choose a JPG, PNG or WebP image.': 'សូមជ្រើសរើសរូបភាព JPG, PNG ឬ WebP។',
    'Choose an image smaller than 10 MB.': 'សូមជ្រើសរើសរូបភាពដែលមានទំហំតិចជាង ១០ MB។',
    'Your browser could not process this image.': 'កម្មវិធីរុករករបស់អ្នកមិនអាចដំណើរការរូបភាពនេះបានទេ។',
    'Could not load your profile:': 'មិនអាចផ្ទុកប្រវត្តិរូបរបស់អ្នកបានទេ៖',
    'Only admins can manage users.': 'មានតែអ្នកគ្រប់គ្រងប៉ុណ្ណោះដែលអាចគ្រប់គ្រងអ្នកប្រើប្រាស់បាន។',
    'Sign in': 'ចូលប្រើ',
    'sign in': 'ចូលប្រើ',
    'password': 'ពាក្យសម្ងាត់',
    'Could not reach the server.': 'មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ។',
    'Wrong email or password. Check both and try again.': 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។ សូមពិនិត្យ ហើយសាកល្បងម្ដងទៀត។',
    'Request failed': 'សំណើមិនបានសម្រេចទេ',
    'Patient name and telephone number are required.': 'ត្រូវបញ្ចូលឈ្មោះអ្នកជំងឺ និងលេខទូរស័ព្ទ។',
    'Patient file not found.': 'រកមិនឃើញឯកសារអ្នកជំងឺទេ។',
    'Session not found.': 'រកមិនឃើញវគ្គព្យាបាលទេ។',
    'Appointment': 'ការណាត់ជួប',
    'Expense': 'ចំណាយ',
    'Admins always have full access. Role permissions set the defaults for Doctors and Assistants; user settings can allow or deny an individual action.': 'អ្នកគ្រប់គ្រងមានសិទ្ធិពេញលេញជានិច្ច។ សិទ្ធិតាមតួនាទីកំណត់សិទ្ធិដើមសម្រាប់គ្រូពេទ្យ និងជំនួយការ ហើយអាចអនុញ្ញាត ឬបដិសេធសកម្មភាពជាក់លាក់សម្រាប់អ្នកប្រើម្នាក់ៗ។',
    'Some actions also require related access: creating an appointment or invoice needs patient view, and creating a session needs session edit to complete the new record.': 'សកម្មភាពខ្លះត្រូវការសិទ្ធិពាក់ព័ន្ធផងដែរ៖ ការបង្កើតការណាត់ជួប ឬវិក្កយបត្រត្រូវការសិទ្ធិមើលអ្នកជំងឺ ហើយការបង្កើតវគ្គព្យាបាលត្រូវការសិទ្ធិកែសម្រួលវគ្គដើម្បីបំពេញកំណត់ត្រាថ្មី។',
    'Role defaults': 'សិទ្ធិដើមតាមតួនាទី',
    'Patient records': 'កំណត់ត្រាអ្នកជំងឺ',
    'Dental sessions': 'វគ្គព្យាបាលធ្មេញ',
    'Reports and statements': 'របាយការណ៍ និងរបាយការណ៍គណនី',
    'View': 'មើល',
    'Create': 'បង្កើត',
    'Edit': 'កែសម្រួល',
    'Delete': 'លុប',
    'Not applicable': 'មិនអាចប្រើបាន',
    'Save role permissions': 'រក្សាទុកសិទ្ធិតាមតួនាទី',
    'Role permissions saved': 'បានរក្សាទុកសិទ្ធិតាមតួនាទី',
    'You do not have permission to view this feature.': 'អ្នកមិនមានសិទ្ធិមើលមុខងារនេះទេ។',
    'Could not load your account permissions. Please refresh or sign in again.': 'មិនអាចផ្ទុកសិទ្ធិគណនីរបស់អ្នកបានទេ។ សូមផ្ទុកទំព័រឡើងវិញ ឬចូលម្តងទៀត។'
  };

  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let language = localStorage.getItem('clinic-language') || 'en';

  function translate(value) {
    if (language !== 'km') return value;
    const trimmed = value.trim();
    if (translations[trimmed]) {
      return value.replace(trimmed, translations[trimmed]);
    }
    const tooth = trimmed.match(/^Tooth (\d+)$/);
    if (tooth) return value.replace(trimmed, `ធ្មេញ ${tooth[1]}`);
    const duration = trimmed.match(/^(\d+) min$/);
    if (duration) return value.replace(trimmed, `${duration[1]} នាទី`);
    const serviceSummary = trimmed.match(/^(\d+) min · (.+)$/);
    if (serviceSummary) return value.replace(trimmed, `${serviceSummary[1]} នាទី · ${serviceSummary[2]}`);
    return value;
  }

  function apply(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      if (root.parentElement?.closest('[translate="no"]')) return;
      if (!originalText.has(root)) originalText.set(root, root.nodeValue);
      root.nodeValue = translate(originalText.get(root));
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('[translate="no"]')) continue;
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      node.nodeValue = translate(originalText.get(node));
    }

    const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll('*')] : [];
    for (const element of elements) {
      let originals = originalAttributes.get(element);
      if (!originals) {
        originals = new Map();
        originalAttributes.set(element, originals);
      }
      for (const attribute of ['placeholder', 'aria-label', 'title', 'alt']) {
        if (!element.hasAttribute(attribute)) continue;
        if (!originals.has(attribute)) originals.set(attribute, element.getAttribute(attribute));
        element.setAttribute(attribute, translate(originals.get(attribute)));
      }
    }

    document.documentElement.lang = language;
    document.querySelectorAll('[data-language]').forEach(select => { select.value = language; });
  }

  document.addEventListener('change', event => {
    if (!event.target.matches('[data-language]')) return;
    language = event.target.value;
    localStorage.setItem('clinic-language', language);
    apply(document.body);
  });

  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const addedNode of record.addedNodes) {
        if (addedNode.nodeType === Node.ELEMENT_NODE || addedNode.nodeType === Node.TEXT_NODE) apply(addedNode);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.ClinicI18n = { translate, apply };
  apply(document.body);
})();
