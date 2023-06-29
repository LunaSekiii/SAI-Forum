import React, { useState, useEffect, memo } from "react";
import { useParams } from "react-router-dom";
import MiddleView from "../../layouts/MiddleView";
import { getArticle } from "../../apis/articles";
import "github-markdown-css";

export default memo(function Article() {
	const { id } = useParams();
	const [detail, setDetail] = useState("");
	// useEffect(() => {
	// 	getArticle(id).then((res) => setDetail(res));
	// 	return () => {};
	// }, [id]);
	return (
		<>
			<div className="bg-article-bg blur-sm opacity-10 fixed top-0 left-0 w-screen h-screen bg-no-repeat bg-cover z-bg" />
			<MiddleView>
				<article className="markdown-body px-10">
					<br />
					<h1>{detail.article?.title}</h1>
					<p></p>
					<p>
						分布式的概念存在年头有点久了，在正式进入我们《分布式专栏》之前，感觉有必要来聊一聊，什么是分布式，分布式特点是什么，它又有哪些问题，在了解完这个概念之后，再去看它的架构设计，理论奠基可能帮助会更大
					</p>
					<p>
						本文将作为专栏的第0篇，将从三个方面来讲述一下我理解的"分布式系统"
					</p>
					<ul>
						<li>分布式系统的特点</li>
						<li>分布式系统面临的挑战</li>
						<li>如何衡量一个分布式系统</li>
					</ul>
					<h2>1.分布式系统特点</h2>
					<p>什么是分布式系统，看一下wiki上的描述</p>
					<h3>1.1 定义</h3>
					<blockquote>
						<p>
							分布式系统（distributed
							system）是建立在网络之上的软件系统。正是因为软件的特性，所以分布式系统具有高度的内聚性和透明性。因此，网络和分布式系统之间的区别更多的在于高层软件（特别是操作系统），而不是硬件
						</p>
						<ul>
							<li>
								<a href="https://baike.baidu.com/item/%E5%88%86%E5%B8%83%E5%BC%8F%E7%B3%BB%E7%BB%9F/4905336">
									分布式系统（建立在网络之上的软件系统）_百度百科
								</a>
							</li>
						</ul>
					</blockquote>
					<blockquote>
						<p>
							分布式操作系统（Distributed operating
							system），是一种软件，它是许多独立的，网络连接的，通讯的，并且物理上分离的计算节点的集合[1]。每个节点包含全局总操作系统的一个特定的软件子集。每个软件子集是两个不同的服务置备的复合物[2]。第一个服务是一个普遍存在的最小的内核，或微内核，直接控制该节点的硬件。第二个服务是协调节点的独立的和协同的活动系统管理组件的更高级别的集合。这些组件抽象微内核功能，和支持用户应用程序[3]。
						</p>
						<ul>
							<li>
								<a href="https://zh.m.wikipedia.org/zh-hans/%E5%88%86%E5%B8%83%E5%BC%8F%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F">
									分布式操作系统 - 维基百科，自由的百科全书
								</a>
							</li>
						</ul>
					</blockquote>
					<blockquote>
						<p>
							Distributed system: is a system in which components
							located on networked computers communicate and
							coordinate their actions by passing messages. The
							components interact with each other in order to
							achieve a common goal[3].
						</p>
						<ul>
							<li>
								<a href="https://computersciencewiki.org/index.php/Distributed_systems">
									Distributed systems - Computer Science Wiki
								</a>
							</li>
						</ul>
					</blockquote>
					<p>
						虽然上面几个描述不完全相同，但是含义其实也差不了太多；基于我个人的理解，用大白话来描述一下分布式系统，就是“一个系统的服务能力，由网络上多个节点共同提供”，正如其名的“分布一词”
					</p>
					<p>
						在了解完分布式系统的概念之后，接下来抓住其主要特点，来加深这个分布式的理解
					</p>
					<h3>1.2 分布性</h3>
					<p>
						分布式系统分布在多个节点（可以理解为多个计算机），这些节点可以是网络上任意的一台计算机，即在空间上没有原则性的限制
					</p>
					<h3>1.3 对等性</h3>
					<p>
						分布式系统中有很多的节点，这些节点之间没有主从、优劣直说，它们应该是对等的，从服务能力来说，访问分布式系统中的任何一个节点，整个服务请求应该都是等价的
					</p>
					<p>
						看到这里可能就会有一个疑问了，分布式系统中经典主从架构，数据拆分架构，就不满足这个对等特性了啊（这个问题先留着，后续再详情中进行解答）
					</p>
					<h3>1.4 自治性</h3>
					<p>
						分布式系统中的各个节点都有自己的计算能力，各自具有独立的处理数据的功能。通常，彼此在地位上是平等的，无主次之分，既能自治地进行工作，又能利用共享的通信线路来传送信息，协调任务处理。
					</p>
					<h3>1.5 并发性</h3>
					<p>
						分布式系统既然存在多个节点，那么天然就存在多个节点的同事响应请求的能力，即并发性支持，如何做好分布式系统的并发控制则是所有分布式系统需要解决的一个问题
					</p>
					<h2>2. 分布式系统面临的问题</h2>
					<p>
						当系统分布在多个节点之上时，自然而然就带来了很多单机场景下不会有问题，如经典的{" "}
						<a href="https://hhui.top/%E5%88%86%E5%B8%83%E5%BC%8F/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/02.%E5%88%86%E5%B8%83%E5%BC%8F%E7%B3%BB%E7%BB%9F%E7%9A%848%E4%B8%AA%E8%B0%AC%E8%AF%AF/">
							分布式系统的8个谬误 | 一灰灰Learning
						</a>
					</p>
					<h3>2.1 全局时钟</h3>
					<p>
						分布式系统的多个节点，如何保证每个节点的时钟一致？这个是需要重点考虑的问题
					</p>
					<p>
						我们知道大名鼎鼎的分布式主键生成算法 “雪花算法”
						就是利用了机器时钟来作为算法因子，如果一个系统的多个节点不能保证时钟统一，那这个算法的唯一性将无法得到保障
					</p>
					<h3>2.2 网络延迟、异常</h3>
					<p>
						网络是有开销的，多个节点之间的通信是有成本的，既然存在网络的开销、或异常状况，那么如何保证多个节点的数据一致性呢？
						当无法保证数据的一致性时，如何提供分布式系统的对等性呢？
					</p>
					<p>
						在经典的CAP理论中，对于P（网络分区）一般都是需要保障的，一个系统存在多个计算节点，那么网络问题将不可避免，网络分区必然会存在
					</p>
					<h3>2.3 数据一致性</h3>
					<p>
						如何保证所有节点中的数据完全一致是一个巨大的挑战，这个问题比较好理解，我们操作分布式系统中的一个节点实现数据修改，如果要保证数据一致性，则要求所有的节点，同步收到这个修改
					</p>
					<p>
						但是我们需要注意的时，网络是不可靠的，且网络的传输是存在延迟的，如何衡量数据的一致性和服务的可用性则是我们在设计一个分布式系统中需要取舍的
					</p>
					<h3>2.4 节点异常</h3>
					<p>
						机器宕机属于不可抗力因素，如果分布式系统中的一个节点宕机了，整个系统会怎么样？要如何确保机器宕机也不会影响系统的可用性呢？
						机器恢复之后，又应该如何保证数据的一致性呢？
						又应该如何判断一个节点是否正常呢？
					</p>
					<h3>2.5 资源竞争</h3>
					<p>
						前面说到分布式系统天然支持并发，那么随之而来的问题则是如何资源竞争的问题；当一个资源同一时刻只允许一个实例访问时，怎么处理？多个系统同时访问一个资源是否会存在数据版本差异性（如经典的ABA问题）、数据一致性问题？
					</p>
					<p>
						基于这个问题，分布式锁可以说是应运而生，相信各位开发大佬都不会陌生这个知识点
					</p>
					<h3>2.6 全局协调</h3>
					<p>这个协调怎么理解呢？ 举几个简单的实例</p>
					<ul>
						<li>
							如何判断分布式系统中那些节点正常提供服务，那些节点故障
						</li>
						<li>
							如一个任务希望在分布式系统中只执行一次，那么应该哪个节点执行这个任务呢？
						</li>
						<li>
							如一组有先后顺序的请求发送给分布式系统，但是由于网络问题，可能出现后面的请求先被系统接收到，这种场景怎么处理呢？
						</li>
						<li>
							一个用户已经登录，如何在所有节点中确认他的身份呢？
						</li>
					</ul>
					<h3>2.7 一灰灰的小结</h3>
					<p>
						实际上分布式系统面临的挑战并不止于上面这些，一个具体的系统面临的问题可能各不相同，但总的来说，分布式系统的理论基础会给我们非常好的指引方向，这一节推荐查看
						*{" "}
						<a href="https://hhui.top/%E5%88%86%E5%B8%83%E5%BC%8F/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/01.%E5%88%86%E5%B8%83%E5%BC%8F%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E7%BB%BC%E8%BF%B0/">
							分布式设计模式综述 | 一灰灰Learning
						</a>
					</p>
					<h2>3. 分布式系统的衡量指标</h2>
					<p>
						最后再来看一下如何衡量一个分布式系统的“好差”，它的指标有哪些
					</p>
					<h3>3.1 性能指标</h3>
					<p>
						常见的性能指标如rt, QPS,
						TPS来判断一个系统的承载能力，重点关注是哪个要点
					</p>
					<ul>
						<li>响应延迟</li>
						<li>并发能力</li>
						<li>事务处理能力</li>
					</ul>
					<h3>3.2 可用性</h3>
					<p>
						这个就是传说中你的系统达到几个9的那个指标，即系统的异常时间占总的可用时间的比例
					</p>
					<p>
						统的可用性可以用系统停服务的时间与正常服务的时间的比例来衡量，也可以用某功能的失败次数与成功次数的比例来衡量。可用性是分布式的重要指标，衡量了系统的鲁棒性，是系统容错能力的体现。
					</p>
					<h3>3.3 扩展性</h3>
					<p>
						系统的可扩展性(scalability)指分布式系统通过扩展集群机器规模提高系统性能（吞吐、延迟、并发）、存储容量、计算能力的特性
					</p>
					<p>
						最简单来讲，就是你的系统能不能直接加机器，来解决性能瓶颈，如果能加机器，有没有上限（如由于数据库的连接数限制了机器的数量上限，
						如机器加到某个程度之后，服务能力没有明显提升）
					</p>
					<h3>3.4 一致性</h3>
					<p>
						分布式系统为了提高可用性，总是不可避免的使用副本的机制，从而引发副本一致性的问题。越是强的一致的性模型，对于用户使用来说使用起来越简单
					</p>
					<h2>4. 总结</h2>
					<p>
						这一篇文章相对来说比较干燥，全是文字描述，介绍下什么是分布式系统，分布系统的特点及面对的问题和衡量指标，提炼一下关键要素，如下
					</p>
					<p>分布式系统的特点</p>
					<ul>
						<li>分布性</li>
						<li>对等性</li>
						<li>并发性</li>
						<li>自治性</li>
					</ul>
					<p>分布式系统面临的挑战</p>
					<ul>
						<li>全局时钟</li>
						<li>网络延迟、异常</li>
						<li>数据一致性</li>
						<li>节点异常</li>
						<li>资源竞争</li>
						<li>全局协调</li>
					</ul>
					<p>分布式系统衡量指标</p>
					<ul>
						<li>性能指标</li>
						<li>可用性</li>
						<li>扩展性</li>
						<li>一致性</li>
					</ul>
					<small>
						<p>
							我是一灰灰，欢迎感兴趣的小伙伴关注最近持续更新的分布式专栏：
						</p>
						<ul>
							<li>
								<a href="https://hhui.top/%E5%88%86%E5%B8%83%E5%BC%8F/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/">
									分布式常用的设计模式 | 一灰灰Learning
								</a>
							</li>
						</ul>
						<p>最后强烈推荐阅读下面两个万字干货</p>
						<ul>
							<li>
								<a href="https://mp.weixin.qq.com/s?__biz=MzU3MTAzNTMzMQ==&mid=2247487507&idx=1&sn=9c4ff02747e8335ee5e3c7765cc80b3c&chksm=fce70bbfcb9082a9a8d972af80f19a9b66a5425c949bc400872727cc2da9f401047a5a523ac4&token=1624762777&lang=zh_CN#rd">
									1w5字详细介绍分布式系统的38个技术方案
								</a>
							</li>
							<li>
								<a href="https://mp.weixin.qq.com/s?__biz=MzU3MTAzNTMzMQ==&mid=2247487533&idx=1&sn=cd07d5d601986fd3911858ea5f3a18d4&chksm=fce70b81cb908297fe66eac564028a6c7ef197f8f10921c4dfe05cf8d433b5ee45566099e467&token=1624762777&lang=zh_CN#rd">
									基于MySql,Redis,Mq,ES的高可用方案解析
								</a>
							</li>
						</ul>
					</small>
				</article>
			</MiddleView>
		</>
	);
});
