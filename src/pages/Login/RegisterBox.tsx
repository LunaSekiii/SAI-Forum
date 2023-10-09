import { postRegister } from "@/apis/user";
import React from "react";

type RegisterBoxProp = {
	change: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisterBox({ change }: RegisterBoxProp) {
	return (
		<div
			className='card w-96 glass absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 transform-gpu'
			style={{ transform: "scale3d(0, 0, 1, 90deg)" }}
		>
			<div className='card-body'>
				<h1 className='text-center font-bold text-3xl'>SAI论坛</h1>
				<p>
					如果已经有账号，点击
					<a
						onClick={() => change(false)}
						className='font-black text-primary cursor-pointer'
					>
						登陆
					</a>
				</p>
				<RegisterForm />
			</div>
		</div>
	);
}

type RegisterInfo = {
	username: string;
	password: string;
	confirmPassword: string;
	email: string;
	// captcha: string;
};
type Action = {
	type: string;
	value: string;
};

const RegisterForm = () => {
	const [registerInfo, dispatchRegisterInfo] = React.useReducer(
		(state: RegisterInfo, action: Action) => {
			switch (action.type) {
				case "username":
					return { ...state, username: action.value };
				case "password":
					return { ...state, password: action.value };
				case "confirmPassword":
					return { ...state, confirmPassword: action.value };
				case "email":
					return { ...state, email: action.value };
				// case "captcha":
				// 	return { ...state, captcha: action.value };
				default:
					return state;
			}
		},
		{
			username: "",
			password: "",
			confirmPassword: "",
			email: "",
			// captcha: "",
		}
	);
	const changeRegisterInfo = (type: string) => {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			dispatchRegisterInfo({
				type,
				value: e.target.value,
			});
		};
	};
	const submitRegister = async () => {
		console.log(registerInfo);
		// 表单验证
		if (registerInfo.username === "") {
			alert("用户名不能为空");
			return;
		}
		if (registerInfo.password === "") {
			alert("密码不能为空");
			return;
		}
		if (registerInfo.confirmPassword === "") {
			alert("确认密码不能为空");
			return;
		}
		if (registerInfo.email === "") {
			alert("邮箱不能为空");
			return;
		}
		if (registerInfo.password !== registerInfo.confirmPassword) {
			alert("两次密码不一致");
			return;
		}

		// 发送请求
		try {
			await postRegister(
				registerInfo.username,
				registerInfo.password,
				registerInfo.email
			);
			alert("注册成功");
		} catch (e) {
			alert("注册失败");
		}
	};

	return (
		<form className='flex flex-col gap-2'>
			<input
				type='text'
				placeholder='用户名'
				className='input input-bordered w-full max-w-xs bg-transparent'
				value={registerInfo.username}
				onChange={changeRegisterInfo("username")}
			/>
			<input
				type='password'
				placeholder='密码'
				className='input input-bordered w-full max-w-xs bg-transparent'
				value={registerInfo.password}
				onChange={changeRegisterInfo("password")}
			/>
			<input
				type='password'
				placeholder='确认密码'
				className='input input-bordered w-full max-w-xs bg-transparent'
				value={registerInfo.confirmPassword}
				onChange={changeRegisterInfo("confirmPassword")}
			/>
			<input
				type='mail'
				placeholder='邮箱'
				className='input input-bordered w-full max-w-xs bg-transparent'
				value={registerInfo.email}
				onChange={changeRegisterInfo("email")}
			/>
			{/* <input
	type='text'
	placeholder='验证码'
	className='input input-bordered w-full max-w-xs bg-transparent'
/> */}
			<div className='card-actions justify-end'>
				<button className='btn btn-primary' onClick={submitRegister}>
					注 册
				</button>
			</div>
		</form>
	);
};
