import { useMemo } from 'react';
import { AtForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from "@/App";

const HowToUseGroupDataKey = ({ ref, onChange }: ExampleComponentInterface) => {
    const formJson = useMemo(() => {
        return formBuilder.utils
            .createFieldDefBuilder([
                // --- Personal Group ---
                formBuilder.createTextBox({
                    id: "firstName",
                    label: "First Name",
                    groupDataKey: "personal"
                }),
                formBuilder.createTextBox({
                    id: "lastName",
                    label: "Last Name",
                    groupDataKey: "personal"
                }),

                // --- Account Group ---
                formBuilder.createTextBox({
                    id: "username",
                    label: "Username",
                    groupDataKey: "account",
                    validation: { required: true }
                }),
                formBuilder.createPasswordTextBox({
                    id: "password",
                    label: "Password",
                    groupDataKey: "account"
                }),

                // --- Root Level Field (Ungrouped) ---
                formBuilder.createCheckBox({
                    id: "acceptTerms",
                    label: "I agree to the Terms and Conditions",
                    validation: { required: true }
                }),
            ])
            .buildAtForm();
    }, []);

    return (
        <AtForm ref={ref} onChange={onChange} validationDisabled={false}>
            {formJson}
        </AtForm>
    );
};

export default HowToUseGroupDataKey;
