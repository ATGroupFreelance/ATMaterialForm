import {
    createMessageDefinitionsFromDefaults,
    type AtMessageDefinition,
} from '../../../localization';
import LocalText from './LocalText';

export const AtFormMessageDefinitions: AtMessageDefinition[] = [
    ...createMessageDefinitionsFromDefaults(LocalText),
    {
        key: 'atform.upload.fileCount',
        defaultMessage: '{count, plural, =0 {No files} one {# file} other {# files}}',
        description: 'Displays the number of files currently selected or uploaded.',
        namespace: 'atform.upload',
        category: 'File upload',
        parameters: {
            count: { type: 'number', required: true, description: 'Number of files.', example: 3 },
        },
    },
    {
        key: 'atform.upload.viewFilesCount',
        defaultMessage: 'View Files ({count, number})',
        description: 'Action label for opening the uploaded-files view with the current file count.',
        namespace: 'atform.upload',
        category: 'File upload',
        parameters: {
            count: { type: 'number', required: true, description: 'Number of files available to view.', example: 3 },
        },
    },
    {
        key: 'atform.file.downloadWithSize',
        defaultMessage: 'Download ({size, number} kB)',
        description: 'Download action label including the file size in kilobytes.',
        namespace: 'atform.file',
        category: 'Files',
        parameters: {
            size: { type: 'number', required: true, description: 'File size in kilobytes.', example: 128 },
        },
    },
    {
        key: 'atform.cardSelect.optionCount',
        defaultMessage: '{count, plural, one {# option} other {# options}}',
        description: 'Displays how many options are available in a CardSelect category.',
        namespace: 'atform.cardSelect',
        category: 'Card select',
        parameters: {
            count: { type: 'number', required: true, description: 'Number of available options.', example: 4 },
        },
    },
    {
        key: 'atform.password.confirmLabel',
        defaultMessage: 'Confirm {label}',
        description: 'Label for the password confirmation field.',
        namespace: 'atform.password',
        category: 'Password',
        parameters: {
            label: { type: 'string', required: true, description: 'Localized password field label.', example: 'Password' },
        },
    },
];
