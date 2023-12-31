import React from "react";

type MiddleViewProp = {
	children: React.ReactNode;
};

/** 居中展示布局 */
export default function MiddleView({ children }: MiddleViewProp) {
	return (
		<div
			className='backdrop-blur-xl bg-base-100  w-2/3  min-w-[800px] max-w-[1200px] m-auto flex flex-col'
			onScroll={(e) => {
				console.log(e);
			}}
		>
			{children}
		</div>
	);
}
