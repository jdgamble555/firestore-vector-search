<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<main class="mt-10 flex flex-col items-center justify-center gap-5">
	<h1 class="text-3xl font-semibold">Firestore Vector Search Example</h1>
	<form method="POST" use:enhance action="?/searchPosts">
		<div class="flex w-72 gap-3">
			<input
				type="text"
				name="text"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				placeholder="Search text..."
				required
			/>
			<button class="rounded-lg border bg-blue-500 p-3 font-semibold text-white" type="submit">
				Go!
			</button>
		</div>
	</form>
</main>
<div class="mt-5 flex flex-col items-center justify-center gap-5">
	<div class="max-w-5xl">
		{#each form?.docs || [] as doc}
			<div class="border p-5">
				{doc.text}
			</div>
		{/each}
	</div>
</div>
