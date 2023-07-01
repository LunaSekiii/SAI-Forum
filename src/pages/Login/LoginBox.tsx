import React from "react";

type LoginBoxProp = { change: React.Dispatch<React.SetStateAction<boolean>> };

export default function LoginBox({ change }: LoginBoxProp) {
	return (
		<div className='card w-96 glass absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2'>
			<figure>
				{/* <img
          src="https://th.bing.com/th?id=OIP.u26lGsiuHaM0G3mdtoiC9gHaDt&w=197&h=113&c=7&o=6&pid=3.1"
          alt="car!"
        /> */}
			</figure>
			<div className='card-body'>
				<h1 className='text-center font-bold text-3xl'>SAI论坛</h1>
				<p>
					如果没有账号，点击
					<a
						onClick={() => change(true)}
						className='font-black text-primary cursor-pointer'
					>
						注册
					</a>
				</p>
				<input
					type='text'
					placeholder='用户名'
					className='input input-bordered w-full max-w-xs bg-transparent'
				/>
				<input
					type='password'
					placeholder='密码'
					className='input input-bordered w-full max-w-xs bg-transparent'
				/>
				<div className='card-actions justify-end'>
					<button className='btn btn-primary'>登 陆</button>
				</div>
			</div>
		</div>
	);
}
