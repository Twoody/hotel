<template>
	<div class="about-wrapper">
		<h1>About Us</h1>
		<div class="about-section">
			<h2>The Creators</h2>
			<p>
				This site is put together by one of the hosts, Tanner Woody.
				However, this site would not be possible without the hard work of Betsy Spencer.
			</p>
			<p>
				Tanner wrote this site using Vue, firebase, jest, vuex, and other technologies.
			</p>
			<p>
				Betsy and Tanner met in Iowa, married in New York, and live in Portland.
				They have three pets:
				<ol>
					<li>
						Bro'Dee
					</li>
					<li>
						Ruby
					</li>
					<li>
						Kouldbie
					</li>
				</ol>
			</p>
		</div>
		<div class="about-section">
			<h2>Outreach</h2>
			<div class="statistics-section">
				<div class="statistic">
					<div class="description">
						People Hosted
					</div>
					<div class="value">
						33
					</div>
				</div>
				<div class="statistic">
					<div class="description">
						Pets Hosted
					</div>
					<div class="value">
						12
					</div>
				</div>
				<div class="statistic">
					<div class="description">
						5 Star Reviews
					</div>
					<div class="value">
						24 (24/25)
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "About",
	components:
	{},
	created: function()
	{
	},
}
</script>

<style lang="less" scoped>
.about-wrapper {
	align-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	max-width: 400px;
	width: 100%;
	.about-section {
		width: 100%;
	}
	h1 {
		flex-grow:1;
		width: 100%;
	}
	p {

	}
}
</style>
