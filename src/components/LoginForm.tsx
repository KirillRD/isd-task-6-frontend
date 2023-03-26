import { Controller, useForm } from 'react-hook-form';
import { LoginFormBody } from '../types';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

type LoginFormProps = {
  className?: string;
  onSubmit: (loginFormBody: LoginFormBody) => void;
}

export const LoginForm = ({ className, onSubmit }: LoginFormProps) => {
  const { control, formState: { errors }, handleSubmit } = useForm<LoginFormBody>({
    defaultValues: {
      name: ''
    }
  });

  const onFormSubmit = (loginFormBody: LoginFormBody) => {
    onSubmit(loginFormBody);
  }

  return (
    <form className={`flex flex-column p-fluid border-1 border-primary-100 border-round-md px-5 pb-5 surface-0 shadow-2 ${className}`} onSubmit={handleSubmit(onFormSubmit)}>
      <h1 className='align-self-center'>Login</h1>

      <label htmlFor='name' className='mb-1'>Name</label>
      <span className='p-input-icon-right'>
        <i className='pi pi-user' />
        <Controller name='name' control={control}
          rules={{
            required: 'Name is required.',
            maxLength: {
              value: 50,
              message: 'Max length exceeded. Length must be less than 50.'
            }
          }}
          render={({ field, fieldState }) => (
          <InputText id={field.name} {...field} placeholder='Username' className={classNames({ 'p-invalid': fieldState.invalid })} />
        )} />
      </span>
      {errors.name && <small className='p-error'>{errors.name.message}</small>}

      <Button type='submit' className='mt-3' label='Submit' />
    </form>
  );
}
