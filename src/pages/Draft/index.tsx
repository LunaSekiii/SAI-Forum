import { deleteDraft, getDraftList } from "@/apis/draft";
import useAuthTo from "@/auth/useAuthTo";
import LoadPerPage from "@/components/LoadPerPage";
import MiddleView from "@/layouts/MiddleView";
import MiddleViewVertical from "@/layouts/MiddleViewVertical";
import ArticleDTO from "@/models/article/ArticleDTO.model";
import DraftDTO from "@/models/article/DraftDTO.model";
import dayjs from "dayjs";
import { useLayoutEffect, useRef, useState } from "react";

const DraftList = () => {
	const [draftList, setDraftList] = useState<DraftDTO[]>([]);
	const draftPage = useRef<number>(0);
	const [hasMoreDraft, setHasMoreDraft] = useState<boolean>(true);
	const authTo = useAuthTo();
	/** 获取一页草稿列表(非自增) */
	const getDraftListPerPage = async (
		page: number,
		reload: boolean = false
	) => {
		const res = await getDraftList(page);
		setDraftList((list) => (reload ? res.list : list.concat(res.list)));
		setHasMoreDraft(res.hasMore);
		draftPage.current = page;
		return res;
	};
	useLayoutEffect(() => {
		// 获取草稿列表
		// getDraftListPerPage(++draftPage.current);
		return () => {
			setDraftList([]);
			setHasMoreDraft(true);
		};
	}, []);
	// TODO: 加载更多
	return (
		<MiddleViewVertical>
			<div className='w-[800px] m-auto'>
				<h1 className='text-3xl font-bold pt-4'>草稿箱</h1>
				<div className='divider my-1' />
				{draftList.map((draft) => (
					<DraftItem
						key={draft.id}
						draftInfo={draft}
						onClick={authTo}
						reloadData={() => {
							getDraftListPerPage(1, true);
						}}
					/>
				))}
				<LoadPerPage
					ended={!hasMoreDraft}
					loadFunc={() => {
						getDraftListPerPage(++draftPage.current);
					}}
					successShow={<div>没有更多了</div>}
				>
					加载中
				</LoadPerPage>
			</div>
		</MiddleViewVertical>
	);
};

const DraftItem = ({
	draftInfo,
	onClick,
	reloadData,
}: {
	draftInfo: DraftDTO;
	onClick: Function;
	reloadData: Function;
}) => {
	return (
		<div className='w-full'>
			<h1
				className='text-xl font-black hover:text-primary cursor-pointer'
				onClick={() =>
					onClick("/edit-article/" + draftInfo.id + "/0", false, true)
				}
			>
				{draftInfo.title || "无标题"}
			</h1>
			<span className='text-gray-500 inline-flex gap-8'>
				<p>
					{dayjs(draftInfo.updateTime).format("YYYY年MM月DD日 HH:mm")}
				</p>
				<DraftInteraction
					onClick={onClick}
					draftId={draftInfo.id}
					reloadData={reloadData}
				/>
			</span>
			<div className='my-1 divider' />
		</div>
	);
};

/**
 * 草稿交互
 */
const DraftInteraction = ({
	onClick,
	draftId,
	reloadData,
}: {
	onClick: Function;
	draftId: number;
	reloadData: Function;
}) => (
	<div className='dropdown dropdown-hover'>
		<label tabIndex={0} className='inline-block min-w-[2rem] text-center'>
			...
		</label>
		<ul
			tabIndex={0}
			className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-20'
		>
			<li>
				<a
					onClick={() =>
						onClick("/edit-article/" + draftId + "/0", false, true)
					}
				>
					编辑
				</a>
			</li>
			<li>
				<a
					onClick={async () => {
						try {
							await deleteDraft(draftId);
							reloadData();
						} catch (e) {
							// TODO: 删除失败提醒
							console.error(e);
						}
					}}
				>
					删除
				</a>
			</li>
		</ul>
	</div>
);

export default DraftList;
