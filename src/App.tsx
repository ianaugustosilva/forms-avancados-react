import { useState } from "react";
import "./styles/global.css";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "./lib/supabase";

const createUserFormSchema = z.object({
	avatar: z
		.instanceof(FileList)
		.transform((list) => list.item(0)!)
		.refine(
			(file) => file.size <= 5 * 1024 * 1024,
			"O arquivo precisa ter no máximo 5Mb"
		),
	name: z
		.string()
		.nonempty("O nome é obrigatório")
		.transform((name) => {
			return name
				.trim()
				.split(" ")
				.map((word) => {
					return word[0].toLocaleUpperCase().concat(word.substring(1));
				})
				.join(" ");
		}),
	email: z
		.string()
		.nonempty("O e-mail é obrigatório")
		.email("Formato de e-mail inválido")
		.toLowerCase()
		.refine((email) => {
			return email.endsWith("@boo.com.br");
		}, "O e-mail precisa ser da boo"),
	password: z.string().min(6, "A senha precisa de no mínimo 6 caracteres"),
	techs: z
		.array(
			z.object({
				title: z.string().nonempty("O título é obrigatório"),
				knowledge: z.coerce.number().min(1).max(100),
			})
		)
		.min(2, "Insira no mínimo duas tecnologias")
		.refine((techs) => {
			return techs.some((tech) => tech.knowledge > 50);
		}, "Você está aprendendo!"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export default function App() {
	const [output, setOutput] = useState("");
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<CreateUserFormData>({
		resolver: zodResolver(createUserFormSchema),
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "techs",
	});

	const addNewTech = () => {
		append({
			title: "",
			knowledge: 0,
		});
	};

	async function createUser(data: CreateUserFormData) {
		await supabase.storage
			.from("forms-react")
			.upload(data.avatar.name, data.avatar);
		setOutput(JSON.stringify(data, null, 2));
	}

	return (
		<main className='h-screen bg-zinc-50 flex flex-col gap-10 items-center justify-center'>
			<form
				onSubmit={handleSubmit(createUser)}
				className='flex flex-col gap-4 w-full max-w-xs'
			>
				{/* <div className='flex flex-col gap-1'>
					<label htmlFor='avatar'>Avatar</label>
					<input accept='image/*' type='file' {...register("avatar")} />
					{errors.avatar && (
						<span className='text-red-500 text-sm'>
							{errors.avatar.message}
						</span>
					)}
				</div> */}

				<div className='flex flex-col gap-1'>
					<label htmlFor='name'>Nome</label>
					<input
						type='text'
						className='border border-zinc-200 shadow-sm rounded h-10 px-3'
						{...register("name")}
					/>
					{errors.name && (
						<span className='text-red-500 text-sm'>{errors.name.message}</span>
					)}
				</div>

				<div className='flex flex-col gap-1'>
					<label htmlFor='email'>E-mail</label>
					<input
						type='email'
						className='border border-zinc-200 shadow-sm rounded h-10 px-3'
						{...register("email")}
					/>
					{errors.email && (
						<span className='text-red-500 text-sm'>{errors.email.message}</span>
					)}
				</div>

				<div className='flex flex-col gap-1'>
					<label htmlFor='password'>Senha</label>
					<input
						type='password'
						className='border border-zinc-200 shadow-sm rounded h-10 px-3'
						{...register("password")}
					/>
					{errors.password && (
						<span className='text-red-500 text-sm'>
							{errors.password.message}
						</span>
					)}
				</div>

				<div className='flex gap-2 flex-col gap-1'>
					<label htmlFor='' className='flex items-center justify-between'>
						Tecnologias
						<button
							type='button'
							onClick={addNewTech}
							className='text-emerald-500 text-sm'
						>
							Adicionar
						</button>
					</label>

					{fields.map((field, index) => {
						return (
							<div className='flex' key={field.id}>
								<div className='flex-1 flex-col gap-1'>
									<input
										type='text'
										className='border border-zinc-200 shadow-sm rounded h-10 px-3'
										{...register(`techs.${index}.title`)}
									/>
									{errors.techs?.[index]?.title && (
										<span>{errors.techs?.[index]?.title?.message}</span>
									)}
								</div>

								<div className='flex flex-col gap-1'>
									<input
										type='number'
										className='w-16 border border-zinc-200 shadow-sm rounded h-10 px-3'
										{...register(`techs.${index}.knowledge`)}
									/>

									{errors.techs?.[index]?.knowledge && (
										<span>{errors.techs?.[index]?.knowledge?.message}</span>
									)}
								</div>
							</div>
						);
					})}
					{errors.techs && (
						<span className='text-red-500 text-sm'>{errors.techs.message}</span>
					)}
				</div>

				<button
					type='submit'
					className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600'
				>
					Salvar
				</button>
			</form>
			<pre>{output}</pre>
		</main>
	);
}
